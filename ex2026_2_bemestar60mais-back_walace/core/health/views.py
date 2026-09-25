from datetime import date, datetime
from rest_framework.response import Response
from django.forms import ValidationError
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from django.utils import timezone

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Avg

from .models import AnamnesisModel, CognitiveGameSessionModel, HealthControlModel, WaterConsumeModel, DailyRecordModel, GlycemiaModel, BloodPressureModel, SelfAssessmentModel

from workouts.models import Workout, WorkoutRateModel
from .serializers import AnamnesisSerializer, BloodPressureSerializer, CognitiveGameSessionSerializer, GlicemyAndBloodSerializer, GlycemiaSerializer, HealthControlSerializer, WaterConsumeSerializer, DailyRecordSerializer, SelfAssessmentSerializer


User = get_user_model()

from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from datetime import datetime
from .models import WaterConsumeModel
from .serializers import WaterConsumeSerializer
from django.contrib.auth.models import User

class WaterConsumeView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = WaterConsumeSerializer
    
    @swagger_auto_schema(
        request_body=WaterConsumeSerializer,
    )
    
    def get_user(self, request, user_id=None):
        """Retorna o usuário correspondente ao ID ou o próprio usuário autenticado"""
        if user_id:
            if request.user.is_staff or request.user.is_superuser:
                try:
                    return User.objects.get(id=user_id)
                except User.DoesNotExist:
                    return None
            else:
                return None
        return request.user
    

    def get(self, request, user_id=None, *args, **kwargs):
        today = date.today()
        user = self.get_user(request, user_id)
        if not user:
            return Response({"message": "Usuário não encontrado ou sem permissão."}, status=status.HTTP_403_FORBIDDEN)

        water_consume, created = WaterConsumeModel.objects.get_or_create(
            user = user,
            date = today,
            defaults={
                'water_goal': 2000,
                'water_consumed': 0,
                'isAchieved': False
            }
        )

        serializer = self.serializer_class(water_consume)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    def post(self, request, *args, **kwargs):
        user = request.user
        data = request.data

        # Convertendo e validando a data
        try:
            request_date_str = data.get('date')
            if not request_date_str:
                # Assume a data de hoje
                request_date = date.today()
            else:
                request_date = datetime.strptime(request_date_str, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            return Response({"message": "Formato de data inválido. Use 'YYYY-MM-DD'."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            water_goal = int(data.get('water_goal', 2000))
            water_consumed = int(data.get('water_consumed', 0))
        except (TypeError, ValueError):
            return Response({"message": "Campos de água devem ser números inteiros."}, status=status.HTTP_400_BAD_REQUEST)

        # Cria ou atualiza
        instance, created = WaterConsumeModel.objects.update_or_create(
            user = user,
            date = request_date,
            defaults = {
                'water_goal': water_goal,
                'water_consumed': water_consumed,
                'isAchieved': water_consumed >= water_goal if water_goal > 0 else False,
            }
        )

        response_status = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=response_status)


from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import generics

class AnamnesisCreateView(generics.CreateAPIView):
    """
    - Usuário comum (aluno) → cria/visualiza sua própria anamnese
    - Personal → pode visualizar a anamnese de um aluno via `user_id`
    """
    serializer_class = AnamnesisSerializer
    permission_classes = [IsAuthenticated]
    
    @swagger_auto_schema(
        request_body=AnamnesisSerializer,
        
    )

    def get_queryset(self):
        user = self.request.user

        if user.role == 'usuario':
            return AnamnesisModel.objects.filter(user=user)

        elif user.role == 'personal':
            user_id = self.request.query_params.get('user_id')
            if not user_id:
                raise PermissionDenied("Você precisa informar o 'user_id' do aluno.")
            target_user = get_object_or_404(User, id=user_id)

            if target_user.personal_id != user.id:
                raise PermissionDenied("Você não tem permissão para ver a anamnese desse aluno.")

            return AnamnesisModel.objects.filter(user=target_user)

        else:
            raise PermissionDenied("Permissão negada.")

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.role != 'usuario':
            raise ValidationError("Apenas usuários podem criar ou atualizar um registro de anamnese.")

        try:
            instance = AnamnesisModel.objects.get(user=user)
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({"message": "Anamnese atualizada com sucesso."}, status=status.HTTP_200_OK)

        except AnamnesisModel.DoesNotExist:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=user)
            return Response({"message": "Anamnese criada com sucesso."}, status=status.HTTP_201_CREATED)



from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime


class DailyRecordView(APIView):
    """Registra ou atualiza um registro diário de saúde de um usuário."""
    
    permission_classes = [IsAuthenticated]       
        
    @swagger_auto_schema(
        request_body=DailyRecordSerializer,
        responses={
            201: "Registro diário criado com sucesso.",
            400: "Erro de validação ou dados ausentes.",
        },
    )
    
    def post(self, request, *args, **kwargs):
        
        # Extrair os dados de glicemia e pressão arterial

        effort_data = request.data.get('effort')
        workout_data = request.data.get('workout')
        rate_data = request.data.get('rate')
        date = request.data.get('date')

        if not effort_data:
            return Response({"message": "Dados de esforço são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)
        if not workout_data:
            return Response({"message": "Dados de treino são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)
        if not rate_data:
            return Response({"message": "Dados de avaliação são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)
        if not date:
            return Response({"message": "Data é obrigatória."}, status=status.HTTP_400_BAD_REQUEST)

        # Convertendo a string de data para um objeto datetime
        try:
            date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return Response({"message": "Formato de data inválido. Use o formato 'YYYY-MM-DD'."}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se já existe um registro diário para a data e o usuário
        daily_record = DailyRecordModel.objects.filter(user=request.user, date=date).first()

        if not daily_record:
            # Cria novos sub-registros apenas se o diário não existir ainda
            workout, _ = Workout.objects.update_or_create(
                user=request.user,
                date=date,
                defaults={
                    'status': workout_data.get('status'),
                    'time': workout_data.get('time')
                }
            )
            effort, _ = SelfAssessmentModel.objects.update_or_create(
                user=request.user,
                date=date,
                defaults={'effort': effort_data}
            )
            rate, _ = WorkoutRateModel.objects.update_or_create(
                user=request.user,
                date=date,
                defaults={'rate': rate_data}
            )

            daily_record = DailyRecordModel.objects.update_or_create(
                user=request.user,
                date=date,
                effort=effort,
                workout=workout,
                rate=rate
            )
        else:
            # Se já existir, carrega os sub-modelos
            effort = daily_record.effort
            workout = daily_record.workout
            rate = daily_record.rate


        # Atualiza os registros de glicemia e pressão arterial caso já existam
        if workout:
            workout.status = workout_data['status']
            workout.time = workout_data['time']
            workout.save()
        
        if effort:
            effort.effort = effort_data
            effort.save()
        
        if rate:
            
            rate.rate = rate_data
            rate.save()
            
            if workout_data.get('status') == 'done':                user = request.user
            # Usamos a 'date' do payload, que é mais preciso do que date.today()
            # pois o usuário pode estar registrando um dia anterior.
            user.ultimo_treino = date 
            user.save(update_fields=['ultimo_treino'])


        # Retorna a resposta com os dados atualizados ou criados
        serializer = DailyRecordSerializer(daily_record)
        
        return Response({"message": "Registro diário criado ou atualizado com sucesso."}, status=status.HTTP_201_CREATED)
    
    
    

from datetime import datetime
from .models import CognitiveGameSessionModel

class CognitiveGameSessionView(APIView):
    permission_classes = [IsAuthenticated]
    @swagger_auto_schema(
        request_body=CognitiveGameSessionSerializer,
        
    )
    def post(self, request):
        serializer = CognitiveGameSessionSerializer(data=request.data)

        if serializer.is_valid():  # ⚠️ Certifique-se de que você está usando os parênteses aqui
            session_date = serializer.validated_data['date']

            if CognitiveGameSessionModel.objects.filter(user=request.user, date=session_date).exists():
                return Response({"detail": "Você já registrou uma sessão para esse dia."}, status=400)

            serializer.save(user=request.user)  # ❌ Remova `date=session_date` — já está incluso
            return Response({"detail": "Sessão registrada com sucesso!"}, status=201)

        return Response(serializer.errors, status=400)
    
class MonthlyCognitiveGameReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # month = request.query_params.get('month')
        # year = request.query_params.get('year')
        user_id = request.query_params.get('user_id')

        # if not month or not year:
        #     return Response({"detail": "Parâmetros 'month' e 'year' são obrigatórios."}, status=400)
        
        # try:
        #     month = int(month)
        #     year = int(year)
        # except ValueError:
        #     return Response({"detail": "Month e Year devem ser números."}, status=400)

        # ⚠️ Verificar se personal solicitou o user_id
        if request.user.role == 'personal':
            if not user_id:
                return Response({"detail": "O parâmetro 'user_id' é obrigatório para personal trainers."}, status=403)

            try:
                target_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"detail": "Aluno não encontrado."}, status=404)

            # Sugestão: Confirme que o personal tem direito sobre este aluno (se tiver esse campo)
            if target_user.personal_id != request.user.id:
                return Response({"detail": "Você não tem permissão para acessar este aluno."}, status=403)

        else:
            target_user = request.user
        
        # SE FOR UM PERSONAL, RETORNA A LISTA COMPLETA    
        if request.user.role == 'personal':
            sessions = CognitiveGameSessionModel.objects.filter(
                user=target_user,
                # date__month=month,
                # date__year=year
            )
            
            serializer = CognitiveGameSessionSerializer(sessions, many=True)
            return Response(serializer.data, status=200)
        
        # SE FOR UM ALUNO, RETORNA APENAS A ÚLTIMA SESSÃO
        else:
            try:
                latest_session = CognitiveGameSessionModel.objects.filter(
                    user=target_user
                ).latest('-date')
                
                serializer = CognitiveGameSessionSerializer(latest_session)
                return Response([serializer.data])
            
            except CognitiveGameSessionModel.DoesNotExist:
                return Response([])


# View para o Usuário - Visualizar e Registrar Controle de Saúde
from django.db import models

from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authentication.models import User  # Certifique-se de importar o User correto
from .models import HealthControlModel
from .serializers import HealthControlSerializer

# View para o Controle de Saúde do Usuário
class UserHealthControlView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Verifica se o usuário é o próprio
        if request.user.role != 'usuario':
            return Response({"error": "Apenas usuários podem acessar esta rota."}, status=status.HTTP_403_FORBIDDEN)

        date = request.query_params.get('date')
        if not date:
            return Response({"error": "O parâmetro 'date' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        # Busca o controle de saúde para o usuário no dia especificado
        queryset = HealthControlModel.objects.filter(user=request.user, date=date)
        if not queryset.exists():
            return Response({"error": "Nenhum dado encontrado para a data informada."}, status=status.HTTP_404_NOT_FOUND)

        # Calcula as médias das categorias
        fields_to_average = [f.name for f in HealthControlModel._meta.fields
                             if isinstance(f, models.IntegerField) and f.name != 'id' and f.name != 'user' and f.name != 'date']

        averages = queryset.aggregate(**{field: Avg(field) for field in fields_to_average})

        # Estrutura as médias nas categorias
        mente = {
            "insonia": averages.get("insonia", None),
            "ansiedade": averages.get("ansiedade", None),
            "estresse": averages.get("estresse", None),
            "falta_de_motivacao": averages.get("falta_de_motivacao", None),
            "dificuldade_de_concentracao": averages.get("dificuldade_de_concentracao", None),
            "tristeza_frequente": averages.get("tristeza_frequente", None),
        }

        cabeca = {
            "enxaqueca": averages.get("enxaqueca", None),
            "tonturas": averages.get("tonturas", None),
            "problemas_de_visao": averages.get("problemas_de_visao", None),
            "zumbido_no_ouvido": averages.get("zumbido_no_ouvido", None),
            "dores_nos_olhos": averages.get("dores_nos_olhos", None),
        }

        corpo = {
            "dor_no_ombro": averages.get("dor_no_ombro", None),
            "dor_nas_costas": averages.get("dor_nas_costas", None),
            "dor_nos_joelhos": averages.get("dor_nos_joelhos", None),
            "caibras": averages.get("caibras", None),
            "fraqueza": averages.get("fraqueza", None),
            "dores_articulares": averages.get("dores_articulares", None),
            "inchaco": averages.get("inchaco", None),
        }

        return Response({
            "usuario": request.user.username,
            "date": date,
            "mente": mente,
            "cabeca": cabeca,
            "corpo": corpo
        })

    @swagger_auto_schema(request_body=HealthControlSerializer)
    def post(self, request):
        # Verifica se o usuário está autenticado como 'usuario'
        if request.user.role != 'usuario':
            return Response({"error": "Somente usuários podem registrar um controle."}, status=status.HTTP_403_FORBIDDEN)

        date = request.data.get('date')
        if not date:
            return Response({"error": "O parâmetro 'date' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se já existe um controle de saúde para esse usuário na mesma data
        existing_control = HealthControlModel.objects.filter(user=request.user, date=date).first()

        if existing_control:
            # Se já existir, atualiza o controle existente
            serializer = HealthControlSerializer(existing_control, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()  # Atualiza o controle de saúde
                return Response({"message": "Controle de saúde atualizado com sucesso."}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Caso contrário, cria um novo controle de saúde
            data = request.data.copy()
            data['user'] = request.user.id  # Define o usuário autenticado no controle
            serializer = HealthControlSerializer(data=data)

            if serializer.is_valid():
                serializer.save()  # Salva o controle de saúde
                return Response({"message": "Controle de saúde registrado com sucesso."}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class InstructorHealthSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Verifica se o usuário é um instrutor
        if request.user.role != 'personal':
            return Response({"error": "Apenas instrutores podem acessar esta rota."}, status=status.HTTP_403_FORBIDDEN)

        # Recupera os parâmetros necessários para a pesquisa
        user_id = request.query_params.get('user_id')
        year = request.query_params.get('year')
        month = request.query_params.get('month')

        if not all([user_id, year, month]):
            return Response({"error": "Parâmetros 'user_id', 'year' e 'month' são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        # Verifica se o usuário existe
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Filtra o controle de saúde do usuário no mês e ano informados
        queryset = HealthControlModel.objects.filter(
            user=target_user,
            date__year=year,
            date__month=month
        )

        # Verifica se existem registros para o usuário no período solicitado
        if not queryset.exists():
            return Response({"message": "Nenhum dado encontrado para este mês."}, status=status.HTTP_404_NOT_FOUND)

        # Calcula a média de todos os campos numéricos (de 0 a 5)
        fields_to_average = [f.name for f in HealthControlModel._meta.fields
                             if isinstance(f, models.IntegerField) and f.name != 'id']

        averages = queryset.aggregate(**{field: Avg(field) for field in fields_to_average})

        # Estrutura as médias nas categorias
        mente = {
            "insonia": averages.get("insonia", None),
            "ansiedade": averages.get("ansiedade", None),
            "estresse": averages.get("estresse", None),
            "falta_de_motivacao": averages.get("falta_de_motivacao", None),
            "dificuldade_de_concentracao": averages.get("dificuldade_de_concentracao", None),
            "tristeza_frequente": averages.get("tristeza_frequente", None),
        }

        cabeca = {
            "enxaqueca": averages.get("enxaqueca", None),
            "tonturas": averages.get("tonturas", None),
            "problemas_de_visao": averages.get("problemas_de_visao", None),
            "zumbido_no_ouvido": averages.get("zumbido_no_ouvido", None),
            "dores_nos_olhos": averages.get("dores_nos_olhos", None),
        }

        corpo = {
            "dor_no_ombro": averages.get("dor_no_ombro", None),
            "dor_nas_costas": averages.get("dor_nas_costas", None),
            "dor_nos_joelhos": averages.get("dor_nos_joelhos", None),
            "caibras": averages.get("caibras", None),
            "fraqueza": averages.get("fraqueza", None),
            "dores_articulares": averages.get("dores_articulares", None),
            "inchaco": averages.get("inchaco", None),
        }

        return Response({
            "usuario": target_user.username,
            "ano": year,
            "mes": month,
            "mente": mente,
            "cabeca": cabeca,
            "corpo": corpo
        })





class UserPerformanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        month_param = request.query_params.get('month')
        target_user_id = request.query_params.get('user_id')  # ID do aluno (opcional)

        if not month_param:
            return Response({"error": "Parâmetro 'month' é obrigatório"}, status=400)
        
        try:
            year, month = map(int, month_param.split('-'))
        except ValueError:
            return Response({"error": "Formato inválido. Use 'YYYY-MM'"}, status=400)
        
        # Verifica se o usuário é um personal e precisa acessar os dados de um aluno
        if user.role == 'personal':
            # Se o usuário for um personal, o `user_id` precisa ser fornecido
            if not target_user_id:
                return Response({"detail": "O parâmetro 'user_id' é obrigatório para usuários 'personal'."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                target_user = get_object_or_404(get_user_model(), id=target_user_id)
            except get_user_model().DoesNotExist:
                return Response({"detail": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)
            # Verifica se o `personal_id` do aluno corresponde ao `id` do personal
            if target_user.personal_id != user.id:
                return Response({"detail": "Você não tem permissão para acessar os dados deste aluno."}, status=status.HTTP_403_FORBIDDEN)
        elif user.role == 'usuario':
            # Se for um aluno, ele só pode acessar seus próprios dados
            target_user = user   
        else:
            return Response({"detail": "Usuário não autorizado."}, status=status.HTTP_403_FORBIDDEN)

        
        water_entries = WaterConsumeModel.objects.filter(
            user=target_user,
            date__year=year,
            date__month=month,
        ).order_by('date')
        water_achieved = water_entries.filter(isAchieved=True).order_by('date')
        achieved_dates = [entry.date.isoformat() for entry in water_entries]
        total_achieved = water_entries.count()
        total_consumed = water_entries.aggregate(total=Sum('water_consumed'))['total'] or 0
        avg_consumed = water_entries.aggregate(avg=Avg('water_consumed'))['avg'] or 0.0

        workout_entries = Workout.objects.filter(
            user=target_user,
            date__year=year,
            date__month=month,
        ).order_by('date')

        trained_dates = [entry.date.isoformat() for entry in workout_entries],
        total_trained = workout_entries.count()
        
        username = target_user.username
        
        # Sessões do jogo cognitivo
        game_sessions = CognitiveGameSessionModel.objects.filter(
            user=target_user,
            date__year=year,
            date__month=month,
        ).order_by('date')

        total_rounds = sum(s.correct_answers + s.incorrect_answers for s in game_sessions)
        total_correct = sum(s.correct_answers for s in game_sessions)
        total_errors = sum(s.incorrect_answers for s in game_sessions)
        accuracy = round((total_correct / total_rounds) * 100, 2) if total_rounds else 0.0
        total_time = sum(s.total_time for s in game_sessions)
        avg_response_time = round((total_time / total_rounds), 2) if total_rounds else 0.0
        fastest = min((s.fastest_response for s in game_sessions), default=None)
        slowest = max((s.slowest_response for s in game_sessions), default=None)
        played_dates = [s.date.isoformat() for s in game_sessions]
        last_played = game_sessions.last().date.isoformat() if game_sessions.exists() else None

        relatory = {
            "username": username,
            "month": month_param,

            "water_relatory": {
                "total_days_achieved": total_achieved,
                "dates_achieved": achieved_dates,
                "total_water_consumed": total_consumed,
                "average_daily_consumption":round(avg_consumed, 2),
            },

            "workout_relatory": {
                "total_days_trained": total_trained,
                "trained_dates": trained_dates,
            },
            "cognitive_game_relatory": {
                "total_rounds": total_rounds,
                "total_correct": total_correct,
                "total_errors": total_errors,
                "accuracy": accuracy,
                "avg_response_time": avg_response_time,
                "fastest_response_time": fastest,
                "slowest_response_time": slowest,
                "total_days_played": len(set(played_dates)),
                "played_dates": played_dates,
                "last_played": last_played,
            },
        }

        return Response(relatory, status=status.HTTP_200_OK)
    

class GlycemiaAndBloodView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_id = request.query_params.get('user_id')
        today = timezone.now().date()

        if request.user.role == 'personal':
            if not user_id:
                return Response({"detail": "O parâmetro 'user_id' é obrigatório para personal trainers."}, status=status.HTTP_400_BAD_REQUEST)
            try:
                target_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"detail": "Aluno não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        else:
            target_user = request.user

        daily_record_today = DailyRecordModel.objects.filter(user=target_user, date=today).first()

        if daily_record_today:
            serializer = GlicemyAndBloodSerializer(daily_record_today)
            return Response([serializer.data])
        else:
            return Response([])
    
    @swagger_auto_schema(request_body=GlicemyAndBloodSerializer)
    def post(self, request):
        date_str = request.data.get("date")
        glycemia_data = request.data.get("glycemia")
        blood_pressure_data = request.data.get("blood_pressure")

        if not date_str or not glycemia_data or not blood_pressure_data:
            return Response({"message": "Campos obrigatórios ausentes."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"message": "Data inválida. Use o formato YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Cria ou atualiza os modelos de Glicemia e Pressão
        glycemia_obj, _ = GlycemiaModel.objects.update_or_create(
            user=request.user,
            date=date_obj,
            defaults={
                'pre_workout': glycemia_data.get('pre_workout'),
                'post_workout': glycemia_data.get('post_workout'),
            }
        )

        bp_obj, _ = BloodPressureModel.objects.update_or_create(
            user=request.user,
            date=date_obj,
            defaults={
                'pre_workout': blood_pressure_data.get('pre_workout'),
                'post_workout': blood_pressure_data.get('post_workout'),
            }
        )

        # 2. A PARTE MAIS IMPORTANTE: Encontra ou cria o DailyRecord e faz o vínculo
        daily_record, created = DailyRecordModel.objects.update_or_create(
            user=request.user,
            date=date_obj,
            defaults={
                'glycemia': glycemia_obj,
                'blood_pressure': bp_obj,
            }
        )

        message = "Dados de saúde criados com sucesso." if created else "Dados de saúde atualizados com sucesso."
        return Response({"message": message}, status=status.HTTP_200_OK)