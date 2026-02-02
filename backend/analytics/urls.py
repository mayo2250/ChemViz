from django.urls import path
from .views import upload_csv, upload_history, generate_pdf_report

urlpatterns = [
    path("upload/", upload_csv),
    path("history/", upload_history),
    path("report/", generate_pdf_report),
]
