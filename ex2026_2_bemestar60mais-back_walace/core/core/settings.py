import os
import dj_database_url
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-i3c1o)5@u+yu6^zkhil3*k+ikpxq&gxsz@%cnv*d1zuz947epm'

DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

ALLOWED_HOSTS = ['*']

CORS_ALLOW_ALL_ORIGINS = True

CORS_ALLOW_CREDENTIALS = True

AUTH_USER_MODEL = 'authentication.User'


# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'miguelgamesjua@gmail.com'
EMAIL_HOST_PASSWORD = 'hzgu angk remu shqj'




INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    #bibliotecas
    'rest_framework',
    'drf_yasg',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'corsheaders',
    


    #apps
    'authentication',
    'workouts',
    'health',
    'graphics',
]




REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    #'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

AUTHENTICATION_BACKENDS = (
    'authentication.authentication_backends.EmailAuthBackend',  # Registra o backend customizado
    'django.contrib.auth.backends.ModelBackend',  # O backend default do Django
)

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASE_URL = os.environ.get('DATABASE_URL')

if DATABASE_URL:
    # Se estiver na Koyeb (ou qualquer ambiente com DATABASE_URL), use-a
    DATABASES = {
        'default': dj_database_url.config(default=DATABASE_URL, conn_max_age=600)
    }
else:
    # Se estiver no ambiente local (sem DATABASE_URL), use a configuração antiga
    # Isso garante que seu ambiente de desenvolvimento local continue funcionando
    print("DATABASE_URL not found, falling back to local settings")
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'BemEstar60',  # Ou os valores que você usa localmente
            'USER': 'django_user',
            'PASSWORD': 'root',
            'HOST': 'db',
            'PORT': '5432',
        }
    }


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),  # Tempo de expiração do Access Token
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),  # Tempo de expiração do Refresh Token
    'ROTATE_REFRESH_TOKENS': True,  # Se True, um novo refresh token será gerado toda vez que você renovar o access token
    'BLACKLIST_AFTER_ROTATION': True,  # Se True, o antigo refresh token será invalidado após a rotação
    'ALGORITHM': 'HS256',  # Algoritmo usado para assinar os tokens
    'SIGNING_KEY': os.getenv('SECRET_KEY', 'django-insecure-i3c1o)5@u+yu6^zkhil3*k+ikpxq&gxsz@%cnv*d1zuz947epm'),  # Chave secreta para assinar os tokens
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),  # Tipo de header para enviar o token
}