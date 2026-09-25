from workouts.serializers import WorkoutRateSerializer, WorkoutSerializer
from rest_framework import serializers
from datetime import datetime
from .models import AnamnesisModel, DailyRecordModel, GlycemiaModel, BloodPressureModel, HealthControlModel, SelfAssessmentModel, WaterConsumeModel, CognitiveGameSessionModel


# Registrar Controle Hídrico

class WaterConsumeSerializer(serializers.ModelSerializer):
    percentage = serializers.SerializerMethodField()

    class Meta:
        model = WaterConsumeModel
        fields = ['date', 'water_goal', 'water_consumed', 'isAchieved', 'percentage']
        read_only_fields = ['isAchieved', 'percentage']
        
    def get_percentage(self, obj):
        if obj.water_goal is not None and obj.water_goal > 0:
            return round((obj.water_consumed / obj.water_goal) * 100, 2)
        return 0
    
    # def get(self, validated_data):
    #     user = self.context['request'].user
    #     date = validated_data.get('date', datetime.now().date())
        
    #     # Verifica se já existe um registro para o usuário na data especificada
    #     water_consume = WaterConsumeModel.objects.filter(user=user, date=date).first()
        
    #     if water_consume:
    #         return water_consume
        
    #     # Se não existir, cria um novo registro com valores padrão
    #     return WaterConsumeModel.objects.create(
    #         user=user,
    #         date=date,
    #         water_goal=0,
    #         water_consumed=0,
    #         isAchieved=False
    #     )
        
    # def create_or_update(self, validated_data):
    #     user = self.context['request'].user
    #     date = validated_data.get('date', datetime.now().date())
    #     water_goal = validated_data.get('water_goal')
    #     water_consumed = validated_data.get('water_consumed')
        
    #     # Verifica se já existe um registro para o usuário na data especificada
    #     water_consume, created = WaterConsumeModel.objects.update_or_create(
    #         user=user,
    #         date=date,
    #         defaults={
    #             'water_goal': water_goal,
    #             'water_consumed': water_consumed,
    #             'isAchieved': water_consumed >= water_goal
    #         }
    #     )
    #     return water_consume
        

# Registrar Ficha de Anamnese

class AnamnesisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnamnesisModel
        exclude = ['user']  # `user` será setado na `create`

    def validate(self, data):
        user = self.context['request'].user
        if user.role != 'usuario':
            raise serializers.ValidationError("Apenas usuários podem criar ou atualizar uma ficha de anamnese.")
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        anamnesis, _ = AnamnesisModel.objects.update_or_create(user=user, defaults=validated_data)
        user.isFirstLogin = False
        user.save()
        return anamnesis



# Registrar Glicemia

class GlycemiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlycemiaModel
        fields = ['date','pre_workout', 'post_workout']

# Registrar Pressão Arterial

class BloodPressureSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodPressureModel
        fields = ['date','pre_workout', 'post_workout']
        
        
class SelfAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelfAssessmentModel
        fields = ['date', 'effort']


# Registrar Registro Diário de Saúde

class DailyRecordSerializer(serializers.ModelSerializer):
    effort = SelfAssessmentSerializer()
    workout = WorkoutSerializer()
    rate = WorkoutRateSerializer()

    class Meta:
        model = DailyRecordModel
        fields = ['date', 'workout', 'effort', 'rate']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        return {
            "date": response['date'],
            "workout": {
                "status": response['workout']['status'],
                "type": response['workout']['type'],
                "time": response['workout']['time'],
            },
            "effort": response['effort'],
            "rate": response['rate'],
            
        }

# Obter Registro Diário de Saúde
class GlicemyAndBloodSerializer(serializers.ModelSerializer):
    glycemia = GlycemiaSerializer(read_only=True)
    blood_pressure = BloodPressureSerializer(read_only=True)

    class Meta:
        model = DailyRecordModel
        fields = ['date', 'glycemia', 'blood_pressure']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        return {
            "date": response['date'],
            "glycemia": {
                "pre_workout": response['glycemia']['pre_workout'],
                "post_workout": response['glycemia']['post_workout'],
            },
            "blood_pressure": {
                "pre_workout": response['blood_pressure']['pre_workout'],
                "post_workout": response['blood_pressure']['post_workout'],
            }
        }
    

class CognitiveGameSessionSerializer(serializers.ModelSerializer):
    date = serializers.DateField(input_formats=['%d-%m-%Y'])

    class Meta:
        model = CognitiveGameSessionModel
        fields = [
            'date', 'correct_answers', 'incorrect_answers',
            'total_time', 'fastest_response', 'slowest_response'
        ]


class HealthControlSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthControlModel
        fields = '__all__'

    def to_internal_value(self, data):
        mente = data.pop('mente', {})
        cabeca = data.pop('cabeca', {})
        corpo = data.pop('corpo', {})

        # Juntando tudo
        flattened = {**data, **mente, **cabeca, **corpo}

        # Verifica se todos os campos esperados estão presentes
        expected_fields = set(self.fields.keys()) - {'id', 'user'}  # Ignora ID e user
        missing_fields = expected_fields - set(flattened.keys())

        if missing_fields:
            raise serializers.ValidationError({
                "detalhes": f"Campos obrigatórios ausentes: {', '.join(missing_fields)}"
            })

        return super().to_internal_value(flattened)

    def validate(self, attrs):
        for field, value in attrs.items():
            if isinstance(value, int) and (value < 0 or value > 5):
                raise serializers.ValidationError({
                    field: "O valor deve estar entre 0 e 5."
                })
        return attrs
