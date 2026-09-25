from django.urls import path
from rest_framework_simplejwt.views import  TokenRefreshView
from .views import *

urlpatterns = [
    path('personal/register/', RegisterPersonalView.as_view(), name='register_personal'),
    path('users/register/', RegisterUserView.as_view(), name='register_user'),
    path('personal/users/', ListAlunosView.as_view({'get': 'list'}), name='list_alunos'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('user-update/', UpdateUserView.as_view(), name='change-user-profile'),
    
    
    path('users/details/', UserDetailsView.as_view()),
    
    path('password-reset/', EmailParaRedefinirSenhaView.as_view(), name='password_reset'),
    path('password-reset-confirm/', RedefinirSenhaView.as_view(), name='password_reset_confirm'),
]

