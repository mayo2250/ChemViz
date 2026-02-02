from django.db import models

class UploadHistory(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    total_equipment = models.IntegerField()
    avg_flowrate = models.FloatField()
    avg_pressure = models.FloatField()
    avg_temperature = models.FloatField()

    def __str__(self):
        return f"Upload {self.id} - {self.uploaded_at}"
