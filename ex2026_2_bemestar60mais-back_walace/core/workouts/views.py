from calendar import month_name
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from collections import defaultdict

from .models import Workout
from .serializers import WorkoutSerializer, WorkoutListSerializer

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth import get_user_model

User = get_user_model()# Listar Treinos

from datetime import datetime, timedelta
from rest_framework.response import Response

class ListWorkoutView(generics.ListAPIView):
    """
    Exibe os treinos de um usuário (aluno) para um personal ou os treinos do próprio usuário.
    Retorna dias treinados e não treinados no mês/ano especificado.
    """
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        # request_body=WorkoutListSerializer, # <--- REMOVIDO!
        manual_parameters=[
            openapi.Parameter('id', openapi.IN_QUERY, description="ID do aluno (obrigatório para personal)", type=openapi.TYPE_INTEGER),
            openapi.Parameter('year', openapi.IN_QUERY, description="Ano para filtrar os treinos", type=openapi.TYPE_INTEGER),
        ],
        responses={
            200: openapi.Response("Lista de treinos obtida com sucesso."),
            401: openapi.Response("Token de acesso inválido ou faltando."),
            403: openapi.Response("ID do aluno não fornecido para personal ou permissão negada."),
            400: openapi.Response("Parâmetro 'year' ausente ou inválido ou ID do aluno inválido."),
            500: openapi.Response("Erro interno do servidor."),
        },
    )
    
    def list(self, request, *args, **kwargs):
        serializer_class = WorkoutListSerializer
        user = request.user
        aluno_id = request.query_params.get('id')
        
        try:
            year_str = request.query_params.get('year')
            year = int(year_str) if year_str else datetime.now().year
        except (ValueError, TypeError):
            return Response({"message": "O parâmetro 'year' deve ser um número inteiro válido."}, status=status.HTTP_400_BAD_REQUEST)

        # Determina o utilizador alvo (aluno ou o próprio utilizador)
        target_user = None
        if user.role == 'personal':
            if not aluno_id:
                raise PermissionDenied("O ID do aluno deve ser fornecido para personal.")
            try:
                target_user = get_object_or_404(User, pk=aluno_id)
            except ValueError:
                return Response({"message": "ID do aluno inválido."}, status=status.HTTP_400_BAD_REQUEST)
        elif user.role == 'usuario':
            if aluno_id and user.id != int(aluno_id):
                raise PermissionDenied("Você não tem permissão para aceder aos treinos deste aluno.")
            target_user = user
        else:
            return Response({"detail": "Permissão negada."}, status=status.HTTP_403_FORBIDDEN)

        if not target_user:
            return Response({"message": "Erro interno: Utilizador alvo não definido."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        hoje = timezone.now().date()
        user_joined_date = target_user.date_joined.date()
        
        # 1. Obter todos os treinos registados para o utilizador alvo no ano especificado
        # Esta consulta deve incluir os treinos de hoje, se existirem.
        workouts_registrados = Workout.objects.filter(
            user=target_user,
            date__year=year
        ).values('date', 'status')

        # Usar conjuntos para pesquisas eficientes de datas treinadas
        datas_treinadas_set = set()
        for workout in workouts_registrados:
            if workout['status'] == 'done':
                datas_treinadas_set.add(workout['date'])

        # 2. Determinar todos os dias a considerar para o status "treinado" ou "não treinado"
        # Esta lista deve ir até hoje para capturar todos os dias treinados possíveis.
        all_relevant_days_up_to_today = []
        if user_joined_date <= hoje:
            current_date = user_joined_date
            while current_date <= hoje: # Incluir hoje nesta lista principal
                if current_date.year == year:
                    all_relevant_days_up_to_today.append(current_date)
                current_date += timedelta(days=1)

        # 3. Classificar os dias
        dias_treinados_formatado = []
        dias_nao_treinados_formatado = []

        # Iterar por todos os dias relevantes até hoje
        for dia in all_relevant_days_up_to_today:
            data_formatada = dia.strftime("%Y-%m-%d")
            if dia in datas_treinadas_set:
                dias_treinados_formatado.append(data_formatada)
            elif dia < hoje: # Adicionar apenas a 'diasNaoTreinados' se for um dia passado e não treinado
                dias_nao_treinados_formatado.append(data_formatada)
            # Se dia == hoje e não estiver em datas_treinadas_set, está implicitamente "pendente" ou ainda não feito para hoje,
            # portanto, não é adicionado a nenhuma lista de acordo com a sua exigência para 'diasNaoTreinados'.
        
        return Response({
            "diasTreinados": dias_treinados_formatado,
            "diasNaoTreinados": dias_nao_treinados_formatado
        })



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from calendar import month_name
from .models import Workout


class WorkoutChartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        if not request.user.is_staff and request.user.id != user_id:
            return Response({"detail": "Sem permissão."}, status=status.HTTP_403_FORBIDDEN)

        # Dicionário com todos os meses
        meses = {
            'janeiro': [],
            'fevereiro': [],
            'março': [],
            'abril': [],
            'maio': [],
            'junho': [],
            'julho': [],
            'agosto': [],
            'setembro': [],
            'outubro': [],
            'novembro': [],
            'dezembro': []
        }

        treinos = Workout.objects.filter(user__id=user_id, status='done')

        for treino in treinos:
            mes_index = treino.date.month
            dia = treino.date.day
            mes_nome = month_name[mes_index].lower()

            traducoes = {
                'january': 'janeiro', 'february': 'fevereiro', 'march': 'março',
                'april': 'abril', 'may': 'maio', 'june': 'junho',
                'july': 'julho', 'august': 'agosto', 'september': 'setembro',
                'october': 'outubro', 'november': 'novembro', 'december': 'dezembro'
            }

            mes_pt = traducoes.get(mes_nome, mes_nome)
            meses[mes_pt].append({
                'value': treino.time,
                'label': f"{dia:02d}"
            })

        return Response(meses)
    
    
from django.shortcuts import get_object_or_404

class TreinouHojeView(APIView):
    """
    Verifica se o usuário treinou hoje.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, aluno_id = None):
        autenticado = request.user
        target_user = None

        # --- Lógica de Permissão e Seleção do Usuário Alvo ---

        if autenticado.role == 'personal':
            if aluno_id is None:
                # Um personal DEVE fornecer o ID de um aluno para consultar
                return Response(
                    {"detail": "Personal deve fornecer o ID do aluno na URL."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Busca o aluno pelo ID fornecido, se não encontrar retorna 404
            target_user = get_object_or_404(User, pk=aluno_id)
        
        elif autenticado.role == 'usuario':
            if aluno_id is not None and autenticado.id != aluno_id:
                # Um usuário comum tentou passar um ID na URL que não é o seu
                return Response(
                    {"detail": "Você só pode verificar seu próprio status de treino."},
                    status=status.HTTP_403_FORBIDDEN
                )
            # O alvo da verificação é o próprio usuário autenticado
            target_user = autenticado

        else:
            # Caso exista algum outro role sem permissão
            return Response({"detail": "Permissão negada."}, status=status.HTTP_403_FORBIDDEN)


        # --- Lógica Principal de Verificação ---

        hoje = timezone.now().date()
        
        # Compara a data do último treino com a data de hoje
        treinou_hoje = target_user.ultimo_treino == hoje
        
        return Response({
            'usuario_id': target_user.id,
            'treinou_hoje': treinou_hoje
        })