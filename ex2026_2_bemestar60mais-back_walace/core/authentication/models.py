from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone
from datetime import timedelta
import random
import string

def generate_otp(length=6):
    """Gera um OTP numérico aleatório."""
    return ''.join(random.choices(string.digits, k=length))

# username_validator = RegexValidator(
#     r'^[a-zA-Z\s]*$', 
#     'O nome de usuário deve conter apenas letras e espaços.'
# )
class User(AbstractUser):
    username = models.CharField(
    max_length=150,
    unique=True,
    help_text='Obrigatório. 150 caracteres ou menos. Apenas letras e espaços são permitidos.',
    # validators=[username_validator],
    error_messages={'unique': "Um usuário com este nome já existe.",},
    )
    
    ROLE_CHOICES = (
        ('personal', 'Personal'),
        ('usuario', 'Usuário'),
    )
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True, null=True)
    personal = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="alunos",
        limit_choices_to={'role': 'personal'}
    )

    email = models.EmailField(unique=True) 
    
    USERNAME_FIELD = 'email'  # Agora o email será usado para autenticação
    REQUIRED_FIELDS = ['username'] 
    
    isFirstLogin = models.BooleanField(default=True)
    # Indica se é o primeiro login do usuário
    ultimo_treino = models.DateField(null=True, blank=True)
    
    password_reset_otp = models.CharField(max_length=6, null=True, blank=True)
    password_reset_otp_expires_at = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    def generate_password_reset_otp(self):
        """Gera e armazena um OTP de redefinição de senha e seu tempo de expiração."""
        self.password_reset_otp = generate_otp()
        self.password_reset_otp_expires_at = timezone.now() + timedelta(minutes=10) # OTP expira em 10 minutos
        self.save(update_fields=['password_reset_otp', 'password_reset_otp_expires_at'])
        return self.password_reset_otp

    def is_password_reset_otp_valid(self, otp_code):
        """Verifica se o OTP fornecido é válido e não expirou."""
        if self.password_reset_otp == otp_code and \
            self.password_reset_otp_expires_at is not None and \
            timezone.now() < self.password_reset_otp_expires_at:
            return True
        return False

    def clear_password_reset_otp(self):
        """Limpa o OTP de redefinição de senha e sua expiração."""
        self.password_reset_otp = None
        self.password_reset_otp_expires_at = None
        self.save(update_fields=['password_reset_otp', 'password_reset_otp_expires_at'])

    def __str__(self):
        return self.email  # Mostra o email como representação do usuário
# Mostra o email ao invés do username
