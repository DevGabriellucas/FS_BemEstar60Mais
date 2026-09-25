from django.urls import path
from .views import  ListWorkoutView, TreinouHojeView

urlpatterns = [
    path('list/', ListWorkoutView.as_view(), name='list_workouts'),  # Listagem dos treinos
    
    path('treinou/<int:id>/aluno/', TreinouHojeView.as_view()),
    path('treinou/', TreinouHojeView.as_view()),  # Verifica se o usuário treinou hoje

    ]
