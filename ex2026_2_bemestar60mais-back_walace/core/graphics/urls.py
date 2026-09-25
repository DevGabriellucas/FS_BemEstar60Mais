from django.urls import path
from .views import BloodPressureChartView, EffortChartView, GlycemiaChartView, HealthChartView, SatisfactionChartView, WorkoutChartView

urlpatterns = [
    path('training-time/', WorkoutChartView.as_view(), name='grafico-treino'),
    path('training-time/<int:user_id>/', WorkoutChartView.as_view(), name='grafico-treino'),

    path('effort/', EffortChartView.as_view(), name='grafico-esforco'),
    path('effort/<int:user_id>/', EffortChartView.as_view(), name='grafico-esforco-user'),
    
    path('rate/', SatisfactionChartView.as_view(), name='grafico-satisfacao'),
    path('rate/<int:user_id>/', SatisfactionChartView.as_view(), name='grafico-satisfacao-user'),

    path('health/<str:group>/<str:field_name>/', HealthChartView.as_view(), name='grafico-saude'),
    path('health/<str:group>/<str:field_name>/<int:user_id>/', HealthChartView.as_view(), name='grafico-saude-user'),
    
    path('glycemia/', GlycemiaChartView.as_view(), name='grafico-glicemia'),
    path('glycemia/<int:user_id>/', GlycemiaChartView.as_view(), name='grafico-glicemia'),
    
    path('blood-pressure/', BloodPressureChartView.as_view(), name='grafico-pressao'),
    path('blood-pressure/<int:user_id>/', BloodPressureChartView.as_view(), name='grafico-pressao'),


]
