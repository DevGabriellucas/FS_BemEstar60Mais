from django.urls import path
from .views import AnamnesisCreateView, CognitiveGameSessionView, GlycemiaAndBloodView, DailyRecordView, InstructorHealthSummaryView, MonthlyCognitiveGameReportView, UserHealthControlView, WaterConsumeView


urlpatterns = [
    path('water-intake/', WaterConsumeView.as_view()),
    path('water-intake/<int:user_id>/', WaterConsumeView.as_view()),
    
    path('anamnesis/', AnamnesisCreateView.as_view()),
    path('anamnesis/<int:user_id>/', AnamnesisCreateView.as_view()),
    
    path('daily-record/', DailyRecordView.as_view()),
    
    path('glicemia-pressao/', GlycemiaAndBloodView.as_view()),
        
    path('game-session/', CognitiveGameSessionView.as_view()),
    path('game-session/report/', MonthlyCognitiveGameReportView.as_view()),
    
    path('health-control/', UserHealthControlView.as_view()),
    path('health-summary/', InstructorHealthSummaryView.as_view()),
    
]