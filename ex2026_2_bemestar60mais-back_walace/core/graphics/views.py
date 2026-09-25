
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model

from calendar import month_name
from workouts.models import Workout, WorkoutRateModel


class WorkoutChartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id=None):
        user = request.user

        # Determina o ID do usuário alvo com base no tipo de usuário
        if hasattr(user, 'role') and user.role == 'personal':
            if user_id is None:
                return Response({"detail": "ID do usuário é necessário para personal trainers."}, status=status.HTTP_400_BAD_REQUEST)
            target_user_id = user_id
        else:
            target_user_id = user.id

        # Inicializa os meses
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

        # Recupera treinos
        treinos = Workout.objects.filter(user__id=target_user_id, status='done')

        traducoes = {
            'january': 'janeiro', 'february': 'fevereiro', 'march': 'março',
            'april': 'abril', 'may': 'maio', 'june': 'junho',
            'july': 'julho', 'august': 'agosto', 'september': 'setembro',
            'october': 'outubro', 'november': 'novembro', 'december': 'dezembro'
        }

        for treino in treinos:
            mes_index = treino.date.month
            dia = treino.date.day
            mes_nome = month_name[mes_index].lower()
            mes_pt = traducoes.get(mes_nome, mes_nome)

            meses[mes_pt].append({
                'value': treino.time,'label': f"{dia:02d}"
            })

        return Response(meses)


from calendar import month_name
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from health.models import BloodPressureModel, SelfAssessmentModel

class EffortChartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id=None):
        user = request.user

        if hasattr(user, 'role') and user.role == 'personal':
            if user_id is None:
                return Response({"detail": "ID do usuário é necessário para personal trainers."}, status=status.HTTP_400_BAD_REQUEST)
            target_user_id = user_id
        else:
            target_user_id = user.id

        # Estrutura dos meses
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

        traducoes = {
            'january': 'janeiro', 'february': 'fevereiro', 'march': 'março',
            'april': 'abril', 'may': 'maio', 'june': 'junho',
            'july': 'julho', 'august': 'agosto', 'september': 'setembro',
            'october': 'outubro', 'november': 'novembro', 'december': 'dezembro'
        }

        avaliacoes = SelfAssessmentModel.objects.filter(user__id=target_user_id)

        for avaliacao in avaliacoes:
            mes_index = avaliacao.date.month
            dia = avaliacao.date.day
            mes_nome = month_name[mes_index].lower()
            mes_pt = traducoes.get(mes_nome, mes_nome)

            meses[mes_pt].append({
                'value': avaliacao.effort,
                'label': f"{dia:02d}"
            })

        return Response(meses)


from calendar import month_name
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from health.models import WorkoutRateModel

class SatisfactionChartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id=None):
        user = request.user

        if hasattr(user, 'role') and user.role == 'personal':
            if user_id is None:
                return Response({"detail": "ID do usuário é necessário para personal trainers."}, status=status.HTTP_400_BAD_REQUEST)
            target_user_id = user_id
        else:
            target_user_id = user.id

        # Estrutura dos meses
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

        traducoes = {
            'january': 'janeiro', 'february': 'fevereiro', 'march': 'março',
            'april': 'abril', 'may': 'maio', 'june': 'junho',
            'july': 'julho', 'august': 'agosto', 'september': 'setembro',
            'october': 'outubro', 'november': 'novembro', 'december': 'dezembro'
        }

        registros = WorkoutRateModel.objects.filter(user__id=target_user_id)

        for registro in registros:
            mes_index = registro.date.month
            dia = registro.date.day
            mes_nome = month_name[mes_index].lower()
            mes_pt = traducoes.get(mes_nome, mes_nome)

            meses[mes_pt].append({
                'value': registro.rate,
                'label': f"{dia:02d}"
            })

        return Response(meses)


from calendar import month_name
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from health.models import HealthControlModel, GlycemiaModel

class HealthChartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    mental_fields = [
        'insonia', 'ansiedade', 'estresse', 'falta_de_motivacao',
        'dificuldade_de_concentracao', 'tristeza_frequente'
    ]
    
    head_fields = [
        'enxaqueca', 'tonturas', 'problemas_de_visao',
        'zumbido_no_ouvido', 'dores_nos_olhos'
    ]

    body_fields = [
        'dor_no_ombro', 'dor_nas_costas', 'dor_nos_joelhos',
        'caibras', 'fraqueza', 'dores_articulares', 'inchaco'
    ]

    def get(self, request, group, field_name, user_id=None):
        user = request.user

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"detail": "user_id inválido."}, status=status.HTTP_400_BAD_REQUEST)

        # Se está pedindo os próprios dados, tudo bem
        if user.id == user_id:
            pass
        # Se é personal, verifica se o user_id pertence a um dos seus alunos
        elif user.role == 'personal':
            if not User.objects.filter(id=user_id, personal_id=user.id).exists():
                return Response({"detail": "Esse usuário não é seu aluno."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"detail": "Sem permissão."}, status=status.HTTP_403_FORBIDDEN)

        valid_fields = {
            'mente': self.mental_fields,
            'cabeca': self.head_fields,
            'corpo': self.body_fields,
        }

        if group not in valid_fields or field_name not in valid_fields[group]:
            return Response({"detail": "Grupo ou campo inválido."}, status=status.HTTP_400_BAD_REQUEST)

        meses = {m: [] for m in [
            'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
            'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ]}

        traducoes = {
            'january': 'janeiro', 'february': 'fevereiro', 'march': 'março',
            'april': 'abril', 'may': 'maio', 'june': 'junho',
            'july': 'julho', 'august': 'agosto', 'september': 'setembro',
            'october': 'outubro', 'november': 'novembro', 'december': 'dezembro'
        }

        registros = HealthControlModel.objects.filter(user__id=user_id).exclude(**{f"{field_name}__isnull": True})

        for reg in registros:
            mes_index = reg.date.month
            dia = reg.date.day
            mes_nome = month_name[mes_index].lower()
            mes_pt = traducoes.get(mes_nome, mes_nome)

            meses[mes_pt].append({
                'value': getattr(reg, field_name),
                'label': f"{dia:02d}"
            })

        return Response(meses)


class GlycemiaChartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        user = request.user

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"detail": "user_id inválido."}, status=status.HTTP_400_BAD_REQUEST)

        # Se está pedindo os próprios dados, tudo bem
        if user.id == user_id:
            pass
        # Se é personal, verifica se o user_id pertence a um dos seus alunos
        elif user.role == 'personal':
            if not User.objects.filter(id=user_id, personal_id=user.id).exists():
                return Response({"detail": "Esse usuário não é seu aluno."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"detail": "Sem permissão."}, status=status.HTTP_403_FORBIDDEN)

        dados = {
            'janeiro': [], 'fevereiro': [], 'março': [], 'abril': [],
            'maio': [], 'junho': [], 'julho': [], 'agosto': [],
            'setembro': [], 'outubro': [], 'novembro': [], 'dezembro': []
        }

        traducoes = {
            'january': 'janeiro', 'february': 'fevereiro', 'march': 'março',
            'april': 'abril', 'may': 'maio', 'june': 'junho',
            'july': 'julho', 'august': 'agosto', 'september': 'setembro',
            'october': 'outubro', 'november': 'novembro', 'december': 'dezembro'
        }

        registros = GlycemiaModel.objects.filter(user__id=user_id).order_by("date")

        for registro in registros:
            dia = registro.date.day
            mes_nome_en = month_name[registro.date.month].lower()
            mes_nome_pt = traducoes[mes_nome_en]
            dados[mes_nome_pt].append({
                'label': f"{dia:02d}",
                'pre': registro.pre_workout,
                'post': registro.post_workout
            })

        return Response(dados)
    

User = get_user_model()
class BloodPressureChartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        user = request.user

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"detail": "user_id inválido."}, status=status.HTTP_400_BAD_REQUEST)

        # Se está pedindo os próprios dados, tudo bem
        if user.id == user_id:
            pass
        # Se é personal, verifica se o user_id pertence a um dos seus alunos
        elif user.role == 'personal':
            if not User.objects.filter(id=user_id, personal_id=user.id).exists():
                return Response({"detail": "Esse usuário não é seu aluno."}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({"detail": "Sem permissão."}, status=status.HTTP_403_FORBIDDEN)

        dados = {
            'janeiro': [], 'fevereiro': [], 'março': [], 'abril': [],
            'maio': [], 'junho': [], 'julho': [], 'agosto': [],
            'setembro': [], 'outubro': [], 'novembro': [], 'dezembro': []
        }

        traducoes = {
            'january': 'janeiro', 'february': 'fevereiro', 'march': 'março',
            'april': 'abril', 'may': 'maio', 'june': 'junho',
            'july': 'julho', 'august': 'agosto', 'september': 'setembro',
            'october': 'outubro', 'november': 'novembro', 'december': 'dezembro'
        }

        registros = BloodPressureModel.objects.filter(user__id=user_id).order_by("date")

        for registro in registros:
            dia = registro.date.day
            mes_nome_en = month_name[registro.date.month].lower()
            mes_nome_pt = traducoes[mes_nome_en]
            dados[mes_nome_pt].append({
                'label': f"{dia:02d}",
                'pre': registro.pre_workout,
                'post': registro.post_workout
            })

        return Response(dados)
