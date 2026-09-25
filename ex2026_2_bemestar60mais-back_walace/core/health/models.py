from django.utils import timezone
from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from workouts.models import Workout, WorkoutRateModel

User = settings.AUTH_USER_MODEL
# Modelo para o registro de consumo de água

class WaterConsumeModel(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name="water_consume"  # Mudando o related_name para algo mais apropriado
    )
    date = models.DateField(default=timezone.now) 
    water_goal = models.IntegerField()
    water_consumed = models.IntegerField()
    isAchieved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} - {self.date} - {self.water_goal} - {self.water_consumed} - {self.isAchieved}"  

# Modelo para a ficha de anamnese

from django.contrib.postgres.fields import ArrayField  # para campos de array
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AnamnesisModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="anamnesis")

    data_nascimento = models.DateField(blank=True, null=True)
    profissao = models.CharField(max_length=255, blank=True, null=True)
    nomeDoResponsavel = models.CharField(max_length=255, blank=True, null=True)
    contatoDoResponsavel = models.CharField(max_length=255, blank=True, null=True)
    
    peso = models.FloatField(default=0.0)
    altura = models.FloatField(default=0.0)
    
    participaDeExtensao = models.BooleanField(default=False)
    praticaAtividade = models.BooleanField(default=False)

    boxSensacoes = ArrayField(models.CharField(max_length=50), blank=True, default=list)

    fazDieta = models.BooleanField(default=False)
    quantasRefeicoes = models.IntegerField(blank=True, null=True)
    horasDeSono = models.IntegerField(blank=True, null=True)
    litrosDeAgua = models.FloatField(blank=True, null=True)
    bebe = models.BooleanField(default=False)
    fuma = models.BooleanField(default=False)

    temColesterolAlto = models.BooleanField(default=False)
    hdl = models.CharField(max_length=20, blank=True, null=True)
    ldl = models.CharField(max_length=20, blank=True, null=True)

    temTrigliceridesAlto = models.BooleanField(default=False)
    diabetico = models.BooleanField(default=False)
    tipoDeDiabete = ArrayField(models.CharField(max_length=10), blank=True, default=list)
    descDiabete = models.TextField(blank=True, null=True)

    hipertenso = models.BooleanField(default=False)
    descHipertenso = models.TextField(blank=True, null=True)

    asma = models.BooleanField(default=False)
    descAsma = models.TextField(blank=True, null=True)

    temProblemasRespiratorios = models.BooleanField(default=False)
    descProblemasRespiratorios = models.TextField(blank=True, null=True)

    paisObesos = models.BooleanField(default=False)
    jaFezCirurgia = models.BooleanField(default=False)
    descCirurgia = models.TextField(blank=True, null=True)

    usaMedicamento = models.BooleanField(default=False)
    descMedicamento = models.TextField(blank=True, null=True)

    recomendacaoMedica = models.BooleanField(default=False)
    descDesconforto = models.TextField(blank=True, null=True)
    descRestricaoMedica = models.TextField(blank=True, null=True)

    objetivos = ArrayField(models.CharField(max_length=50), blank=True, default=list)
    descOutro = models.TextField(blank=True, null=True)

    problemaDeCoracao = models.BooleanField(default=False)
    doresNoPeito = models.BooleanField(default=False)
    doresNoPeitoEmAtividade = models.BooleanField(default=False)
    desequilibrio = models.BooleanField(default=False)
    problemaOsseo = models.BooleanField(default=False)
    medicamentoParaPressao = models.BooleanField(default=False)
    outrasRazoes = models.BooleanField(default=False)
    descOutrasRazoes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Anamnese de {self.user.get_full_name() or self.user.email}"



# Modelo para glicemia

class GlycemiaModel(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='glycemia')
    date = models.DateField(default=timezone.now)
    pre_workout = models.IntegerField()
    post_workout = models.IntegerField()

    def __str__(self):
        return f"Glicemia de {self.user.get_full_name() or self.user.email} - {self.date}"


# Modelo para pressão arterial

class BloodPressureModel(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='blood_pressure')
    date = models.DateField(default=timezone.now)
    pre_workout = models.IntegerField()
    post_workout = models.IntegerField()

    def __str__(self):
        return f"Pressão arterial de {self.user.get_full_name() or self.user.email} - {self.date}"
    
class SelfAssessmentModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField(default=timezone.now)
    effort = models.IntegerField()
    
    

# Modelo para o registro diário de saúde

class DailyRecordModel(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='daily_record', 
        db_index=True)
    date = models.DateField(
        default=timezone.now, 
        db_index=True)
    
    # Relacionamentos com os modelos de glicemia e pressão arterial
    glycemia = models.OneToOneField(GlycemiaModel, on_delete=models.SET_NULL, null=True, blank=True)
    blood_pressure = models.OneToOneField(BloodPressureModel, on_delete=models.SET_NULL, null=True, blank=True)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, null=True, blank=True)
    effort = models.ForeignKey(SelfAssessmentModel, on_delete=models.CASCADE, null=True, blank=True)
    rate = models.ForeignKey(WorkoutRateModel, on_delete=models.CASCADE, null=True, blank=True)
    

    def __str__(self):
        return f"Registro diário de saúde de {self.user.get_full_name() or self.user.email} - {self.date}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'date'], name='unique_daily_record_per_day')
    ]



    
    
class CognitiveGameSessionModel(models.Model):
        
        user = models.ForeignKey(User, on_delete=models.CASCADE)
        date = models.DateField()
        correct_answers = models.IntegerField()
        incorrect_answers = models.IntegerField()
        total_time = models.FloatField(help_text="Tempo total da sessão em segundos")
        fastest_response = models.FloatField()
        slowest_response = models.FloatField()
        
            
        def total_rounds(self):
            return self.correct_answers + self.incorrect_answers
 
        def accuracy(self):
            total = self.total_rounds()
            return (self.correct_answers / total * 100) if total > 0 else 0


class HealthControlModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    insonia = models.IntegerField(default=0, blank=True, null=True)
    ansiedade = models.IntegerField(default=0, blank=True, null=True)
    estresse = models.IntegerField(default=0, blank=True, null=True)
    falta_de_motivacao = models.IntegerField(default=0, blank=True, null=True)
    dificuldade_de_concentracao = models.IntegerField(default=0, blank=True, null=True)
    tristeza_frequente = models.IntegerField(default=0, blank=True, null=True)
    
    enxaqueca = models.IntegerField(default=0, blank=True, null=True)
    tonturas = models.IntegerField(default=0, blank=True, null=True)
    problemas_de_visao = models.IntegerField(default=0, blank=True, null=True)
    zumbido_no_ouvido = models.IntegerField(default=0, blank=True, null=True)
    dores_nos_olhos = models.IntegerField(default=0, blank=True, null=True)
    
    dor_no_ombro = models.IntegerField(default=0, blank=True, null=True)
    dor_nas_costas = models.IntegerField(default=0, blank=True, null=True)
    dor_nos_joelhos = models.IntegerField(default=0, blank=True, null=True)
    caibras = models.IntegerField(default=0, blank=True, null=True)
    fraqueza = models.IntegerField(default=0, blank=True, null=True)
    dores_articulares = models.IntegerField(default=0, blank=True, null=True)
    inchaco = models.IntegerField(default=0, blank=True, null=True)


    def __str__(self):
        return f"Controle de saúde de {self.user} - {self.date}"