from django.forms import ValidationError
from health.models import AnamnesisModel
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
User = get_user_model()
from django.core.mail import send_mail
from core import settings
from .models import User


# Registrar Personal

class PersonalRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'phone', 'role', 'isFirstLogin','date_joined']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['role'] = 'personal'  # Força o papel de personal
        user = User.objects.create_user(**validated_data)
        return user

# Registrar Aluno

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'phone']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        personal = self.context['request'].user  # Obtém o personal autenticado
        if personal.role != 'personal':
            raise serializers.ValidationError("Apenas personais podem registrar alunos.")
        
        validated_data['role'] = 'usuario'
        validated_data['personal'] = personal  # Relaciona o aluno ao personal
        user = User.objects.create_user(**validated_data)
        return user

# Login

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from django.contrib.auth import get_user_model

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Email ou senha incorretos.")

        if not user.check_password(password):
            raise serializers.ValidationError("Email ou senha incorretos.")

        # Gera os tokens
        refresh = RefreshToken.for_user(user)

        return {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'isFirstLogin': user.isFirstLogin,
        }


# Redefinir Senha

class ChangePasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True, write_only=True)
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        # Valida se a nova senha e a confirmação são iguais
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError("As senhas novas não coincidem.")
        return attrs
    
    
User = get_user_model()

class UserDetailsSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='user.id')
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    role = serializers.CharField(source='user.role')
    data_nascimento = serializers.DateField(source='anamnesis.data_nascimento')
    phone = serializers.CharField(source='user.phone')
    contato_emergencia = serializers.CharField(source='anamnesis.contato_emergencia')
    altura = serializers.FloatField(source='anamnesis.altura')
    peso = serializers.FloatField(source='anamnesis.peso')
    ehParticipanteDoProjeto = serializers.BooleanField(source='anamnesis.ehParticipanteDoProjeto')
    fazExercicios = serializers.BooleanField(source='anamnesis.fazExercicios')
    
class UserUpdateSerializer(serializers.ModelSerializer):
    # Serializer para a atualização de dados básicos do usuário.
    class Meta:
        model = User
        fields = ['username', 'email', 'phone']
        extra_kwargs = {
            'email': {'required': False},
            'username': {'required': False},
            'phone': {'required': False},
        }

    def validate_email(self, value):
        # Garante que o novo email não esteja em uso por outro usuário.
        # Pega o usuário que está fazendo a requisição a partir do contexto da view
        user = self.context['request'].user
        if User.objects.filter(email=value).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Este endereço de email já está em uso.")
        return value
    
class EmailParaRedefinirSenhaSerializer(serializers.Serializer):
    """
    Serializer para solicitar um OTP de redefinição de senha.
    """
    email = serializers.EmailField()

    default_error_messages = {
        'no_user': 'Nenhum usuário encontrado com este e-mail.'
    }

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(self.error_messages['no_user'])
        return value

    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        otp = user.generate_password_reset_otp()

        # Enviar e-mail com o OTP
        # Adapte a URL do frontend conforme necessário
        frontend_url = "https://seu-frontend.com/resetar-senha" # Exemplo
        
        send_mail(
            subject="Seu Código de Redefinição de Senha",
            message=f"Olá {user.username or user.email},\n\n"
                    f"Use o seguinte código de 6 dígitos para redefinir sua senha: {otp}\n\n"
                    f"Este código expirará em 10 minutos.\n\n"
                    f"Se você não solicitou esta redefinição, por favor ignore este e-mail.\n\n"
                    f"Para redefinir sua senha, acesse: {frontend_url} e informe seu e-mail e este código.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )
        print(otp)
        return user # Retorna o usuário para possível uso na view

class RedefinirSenhaSerializer(serializers.Serializer):
    """
    Serializer para verificar o OTP e definir uma nova senha.
    """
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6, min_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8, 
                                        error_messages={'min_length': 'A senha deve ter pelo menos 8 caracteres.'})
    confirm_password = serializers.CharField(write_only=True)

    default_error_messages = {
        'no_user': 'Nenhum usuário encontrado com este e-mail.',
        'invalid_otp': 'Código OTP inválido ou expirado.',
        'password_mismatch': 'As senhas não coincidem.'
    }

    def validate(self, attrs):
        email = attrs.get('email')
        otp_code = attrs.get('otp')
        new_password = attrs.get('new_password')
        confirm_password = attrs.get('confirm_password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({'email': [self.error_messages['no_user']]})

        if not user.is_password_reset_otp_valid(otp_code):
            raise serializers.ValidationError({'otp': [self.error_messages['invalid_otp']]})

        if new_password != confirm_password:
            raise serializers.ValidationError({'confirm_password': [self.error_messages['password_mismatch']]})
        
        attrs['user'] = user # Adiciona o usuário ao contexto validado
        return attrs

    def save(self):
        user = self.validated_data['user']
        new_password = self.validated_data['new_password']
        
        user.set_password(new_password)
        user.clear_password_reset_otp() # Limpa o OTP após o uso bem-sucedido
        user.save()
        return user


    
