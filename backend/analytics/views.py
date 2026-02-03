import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import UploadHistory
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from django.http import HttpResponse



@api_view(['POST'])
@permission_classes([AllowAny])
def upload_csv(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=400)

    file = request.FILES.get("file")
    if not file:
        return JsonResponse({"error": "No file uploaded"}, status=400)

    try:
        df = pd.read_csv(file)
    except Exception:
        return JsonResponse({"error": "Invalid CSV file"}, status=400)

    # 1. Validate Columns
    required_cols = {"Flowrate", "Pressure", "Temperature"}
    if not required_cols.issubset(df.columns):
        return JsonResponse(
            {"error": "CSV must contain Flowrate, Pressure, Temperature columns"},
            status=400
        )

    # 2. Calculate Aggregates
    total = len(df)
    avg_flow = df["Flowrate"].mean()
    avg_pressure = df["Pressure"].mean()
    avg_temp = df["Temperature"].mean()

    # 3. Calculate Distribution 
    distribution = {}
    eq_col = None
    for col in ['EquipmentClass', 'EquipmentType', 'Equipment', 'Type']:
        if col in df.columns:
            eq_col = col
            break
    
    if eq_col:
        # Get counts of each type and convert to normal dict (int, not numpy types)
        dist_series = df[eq_col].value_counts()
        distribution = {k: int(v) for k, v in dist_series.items()}

    # 4. Save to DB
    UploadHistory.objects.create(
        total_equipment=total,
        avg_flowrate=avg_flow,
        avg_pressure=avg_pressure,
        avg_temperature=avg_temp
    )

    # 5. Maintain only last 5 records
    records = UploadHistory.objects.order_by("-uploaded_at")
    if records.count() > 5:
        for record in records[5:]:
            record.delete()

    # 6. Return Response with Distribution
    return JsonResponse({
        "message": "File processed successfully",
        "total_equipment": total,
        "avg_flowrate": round(avg_flow, 2),
        "avg_pressure": round(avg_pressure, 2),
        "avg_temperature": round(avg_temp, 2),
        "equipment_distribution": distribution  # <--- Sending this to Frontend
    })

@csrf_exempt
def upload_history(request):
    records = UploadHistory.objects.order_by("-uploaded_at")[:5]

    data = []
    for r in records:
        data.append({
            "uploaded_at": r.uploaded_at,
            "total_equipment": r.total_equipment,
            "avg_flowrate": round(r.avg_flowrate, 2),
            "avg_pressure": round(r.avg_pressure, 2),
            "avg_temperature": round(r.avg_temperature, 2)
        })

    return JsonResponse(data, safe=False)

def generate_pdf_report(request):
    record = UploadHistory.objects.order_by("-uploaded_at").first()

    if not record:
        return JsonResponse({"error": "No data available to generate report"}, status=400)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="chemviz_report.pdf"'

    c = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    y = height - 50

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Chemical Equipment Analysis Report")

    y -= 40
    c.setFont("Helvetica", 12)
    c.drawString(50, y, f"Total Equipment: {record.total_equipment}")

    y -= 25
    c.drawString(50, y, f"Average Flowrate: {round(record.avg_flowrate, 2)}")

    y -= 25
    c.drawString(50, y, f"Average Pressure: {round(record.avg_pressure, 2)}")

    y -= 25
    c.drawString(50, y, f"Average Temperature: {round(record.avg_temperature, 2)}")

    y -= 25
    c.drawString(50, y, f"Uploaded At: {record.uploaded_at}")

    c.showPage()
    c.save()

    return response