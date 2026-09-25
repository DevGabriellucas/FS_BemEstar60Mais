from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL
class Workout(models.Model):
    STATUS_CHOICES = (
        ('done', 'Treino Concluído'),
        ('missed', 'Faltou'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name="workouts"
    )
    date = models.DateField(default=timezone.now)  # Permite escolher a data do treino
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    type = models.CharField(max_length=255, default="Treino")  # Tipo de treino (ex: musculação, funcional, etc.)
    time = models.IntegerField(default=0)  # Tempo em minutos
    
    class Meta:
        indexes = [
            models.Index(fields=['user', '-date'])
        ]

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} - {self.date} - {self.get_status_display()}"


class WorkoutRateModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    rate = models.IntegerField()