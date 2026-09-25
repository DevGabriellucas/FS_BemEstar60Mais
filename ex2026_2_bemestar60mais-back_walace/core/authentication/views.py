from health.models import AnamnesisModel
from rest_framework import generics, permissions, viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from django.contrib.auth import authenticate, login

from .models import User
from .serializers import *

# Registro de Personal
class RegisterPersonalView(generics.CreateAPIView):
    """Registra um Personal"""
    queryset = User.objects.all()
    serializer_class = PersonalRegisterSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        request_body=PersonalRegisterSerializer,
        responses={
            201: openapi.Response("Personal registrado com sucesso."),
            400: openapi.Response("Dados inválidos ou faltando."),
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = PersonalRegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Personal registrado com sucesso."}, status=status.HTTP_201_CREATED)
        
        if serializer.errors.get('email'):
            return Response({"message": "Email já cadastrado."}, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.errors.get('username') or serializer.errors.get('password') or serializer.errors.get('phone')  or serializer.errors.get('role'):
            return Response({"message": "Dados inválidos ou faltando."}, status=status.HTTP_400_BAD_REQUEST)
        
        
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Registro de Usuário
class RegisterUserView(generics.CreateAPIView):
    """Registra um Usuário"""
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=UserRegisterSerializer,
        responses={
            201: openapi.Response("Usuário registrado com sucesso."),
            400: openapi.Response("Dados inválidos ou faltando."),
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuário registrado com sucesso."}, status=status.HTTP_201_CREATED)
        
        if serializer.errors.get('email'):
            return Response({"message": "Email já cadastrado."}, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.errors.get('username') or serializer.errors.get('password') or serializer.errors.get('phone'):
            return Response({"message": "Dados inválidos ou faltando."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateUserView(generics.RetrieveUpdateAPIView):
    """
    Visualiza e atualiza os dados do usuário autenticado (nome, email e telefone).
    Permite métodos GET, PUT e PATCH.
    """
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Sobrescreve o método padrão para que a view sempre retorne
        o usuário que está fazendo a requisição. Isso garante que um usuário
        só possa ver e editar seu próprio perfil.
        """
        return self.request.user

    @swagger_auto_schema(
        request_body=UserUpdateSerializer,
        responses={
            200: UserUpdateSerializer,
            400: openapi.Response("Dados inválidos."),
            401: openapi.Response("Não autenticado."),
        },
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=UserUpdateSerializer,
        responses={
            200: UserUpdateSerializer,
            400: openapi.Response("Dados inválidos."),
            401: openapi.Response("Não autenticado."),
        },
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        Adiciona uma mensagem de sucesso customizada à resposta padrão.
        """
        response = super().update(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            custom_data = {
                "message": "Usuário atualizado com sucesso.",
                "data": response.data
            }
            response.data = custom_data
        return response

# Listar Usuários
class ListAlunosView(viewsets.ReadOnlyModelViewSet):
    """Listar Usuários cadastrados pelo Personal autenticado"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserRegisterSerializer
    
    @swagger_auto_schema(
        responses={
            200: openapi.Response("Lista de alunos obtida com sucesso."),
            403: openapi.Response("Acesso negado."),
        },
    )

    def get_queryset(self):
        user = self.request.user
        if user.role != 'personal':
            return User.objects.none()
        return user.alunos.all()

# Login
class LoginView(APIView):
    """Login de Usuários e Personal"""
    permission_classes = [AllowAny]
    serializer = LoginSerializer

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={
            200: openapi.Response("Login com sucesso."),
            400: openapi.Response("Preencha o email e senha."),
            401: openapi.Response("Credenciais inválidas."),
        },
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        if serializer.errors.get('non_field_errors'):
            return Response({"message": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
        
        if serializer.errors.get('email') or serializer.errors.get('password'):
            return Response({"message": "Preencha o email e senha."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Trocar Senha
class ChangePasswordView(APIView):
    """Troca de senha do usuário"""
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=ChangePasswordSerializer,
        responses={
            200: openapi.Response("Senha alterada com sucesso."),
            400: openapi.Response("Preencha os campos corretamente."),
            401: openapi.Response("Senha antiga incorreta."),
        },
    )
    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            confirm_password = serializer.validated_data['confirm_password']
            
            if email != user.email:
                return Response({"message": "Email não corresponde ao usuário autenticado."}, status=status.HTTP_400_BAD_REQUEST)
            
            if not user.check_password(old_password):
                return Response({"message": "Senha antiga incorreta."}, status=status.HTTP_401_UNAUTHORIZED)
            
            if new_password != confirm_password:
                return Response({"message": "As senhas novas não coincidem."}, status=status.HTTP_400_BAD_REQUEST)
            
            if old_password == new_password:
                return Response({"message": "A nova senha deve ser diferente da antiga."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Atualizar a senha
            user.set_password(new_password)
            user.save()

            return Response({"message": "Senha alterada com sucesso."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
from django.shortcuts import get_object_or_404

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        authenticated_user = request.user
        user_to_fetch = None
        anamnesis_to_fetch = None

        if authenticated_user.role == 'personal':
            student_id = request.query_params.get('user_id')
            if not student_id:
                return Response(
                    {"detail": "Parâmetro 'user_id' é obrigatório para personal."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            student = get_object_or_404(User, id=student_id)

            if not hasattr(student, 'personal_trainer') or student.personal_trainer != authenticated_user:
                 return Response(
                     {"detail": "Você não tem permissão para acessar os dados deste aluno."},
                     status=status.HTTP_403_FORBIDDEN
                 )

            user_to_fetch = student
            
            try:
                anamnesis_to_fetch = AnamnesisModel.objects.get(user=student)
            except AnamnesisModel.DoesNotExist:
                # Se não encontrar a anamnese do aluno, pode retornar 404 ou 200 com mensagem
                return Response(
                    {"detail": f"Anamnese não encontrada para o aluno com ID {student.id}."},
                    status=status.HTTP_404_NOT_FOUND
                )

        else:
            user_to_fetch = authenticated_user
            
            try:
                anamnesis_to_fetch = AnamnesisModel.objects.get(user=authenticated_user)
            except AnamnesisModel.DoesNotExist:
                # Se não encontrar a anamnese do próprio usuário, pode retornar 404 ou 200 com mensagem
                return Response(
                    {"detail": "Sua anamnese não foi encontrada. Por favor, preencha-a."},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        data = {
            'user': user_to_fetch,
            'anamnesis': anamnesis_to_fetch, # anamnesis_to_fetch será um objeto AnamnesisModel
        }

        serializer = UserDetailsSerializer(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


User = get_user_model()


class EmailParaRedefinirSenhaView(APIView):
    """
    Envia um OTP de 6 dígitos para o e-mail do usuário para redefinição de senha.
    """

    @swagger_auto_schema(request_body=EmailParaRedefinirSenhaSerializer)
    def post(self, request):
        serializer = EmailParaRedefinirSenhaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # O método save do serializer agora lida com a geração do OTP e envio de e-mail
            return Response(
                {"message": "Se um usuário com este e-mail existir, um código OTP foi enviado."}, 
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RedefinirSenhaView(APIView):
    """
    Verifica o OTP e define uma nova senha para o usuário.
    """

    @swagger_auto_schema(request_body=RedefinirSenhaSerializer)
    def post(self, request):
        serializer = RedefinirSenhaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # O método save do serializer agora redefine a senha e limpa o OTP
            return Response({"message": "Senha redefinida com sucesso."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)