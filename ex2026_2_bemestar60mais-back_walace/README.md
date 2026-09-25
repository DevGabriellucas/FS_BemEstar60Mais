# BemEstar-Back
Este é o backend do projeto BemEstar, utilizando Django e PostgreSQL no Docker.

### Requisitos
Docker e Docker Compose instalados em sua máquina.

## Passo a Passo
### 1. Clonar o repositório
Clone o repositório para a sua máquina local:

```
git clone https://gitlab.com/repositoriodafabrica/ex2025_1_bemestar60mais_edkallenn.git
cd ex2025_1_bemestar60mais_edkallenn
```

### 2. Construir e subir os contêineres
Com o Docker e Docker Compose instalados, execute o comando abaixo para construir e iniciar os contêineres:

```
docker-compose up --build
```

Este comando irá:

* Construir as imagens (se necessário).
* Subir o banco de dados PostgreSQL.
* Subir o servidor Django.
* Rodar as migrações automaticamente.

### 3. Criar um superusuário (caso necessário)
Se você precisar criar um superusuário para acessar o Django Admin, execute o comando abaixo:

```
docker-compose exec web python manage.py createsuperuser
```

Siga as instruções para definir um nome de usuário, e-mail e senha.

### 4. Acessar a aplicação
Após a inicialização, a aplicação estará disponível no seguinte endereço:

Django Admin: http://localhost:8000/admin/

API: http://localhost:8000/

Você pode acessar a aplicação no seu navegador ou fazer requisições à API.

### 5. Parar os contêineres
Quando terminar de usar a aplicação, você pode parar os contêineres com:

```
docker-compose down
```

# Endpoints

--- 

## Authentication

#

### Registrar Personal


**POST** `/auth/personal/register/`

#### Descrição:
- Registrar um novo personal trainer.
- Esse endpoint não precisa de token pra ser usado.


#### Body:
```json
{
  "username": "test",
  "password": "testpassword",
  "email": "test@test.com",
  "role": "personal",
  "phone": "123456789"
}
```

#### Return:

- 200:

```json
{
	"username": "test",
	"email": "test@test.com",
	"phone": "123456789",
	"role": "personal"
}
```

400:
```json
{
	"message": "Email já cadastrado."
}
```

401:
```json
{
	"message": "Dados inválidos ou faltando."
}
```
---

### Registrar Aluno

**POST** `/auth/users/register/`

#### Headers:
- `Authorization`: Bearer token

#### Descrição:
- Registrar um novo Aluno
- Esse endpoint precisa de token para ultilização.
- Apenas personais podem registrar um aluno.

#### Body:
```json
{
  "username": "test4",
  "password": "test4password",
  "email": "test4@test.com",
  "role": "usuario",
  "phone": "123456789"
}
```

#### Return:

200:
```json
{
	"message": "Usuário registrado com sucesso."
}
```

400:
```json
{
	"message": "Email já cadastrado."
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

### Login
**POST** `/auth/login/`

#### Descrição:
- Autenticar um personal ou aluno.
- Esse endpoint não precisa de token para ser acessado.

#### Body:
```json
{
  "email": "user@example.com",
  "password": "usuario1"
}
```

#### Returns:

- 200:
```json
{
	"id": 1,
	"username": "test",
	"email": "test@test.com",
	"refresh": "eyJ...Bns",
	"access": "eyJ...WWk",
	"isFirstLogin": false
}
```

- 400:
```json
{
	"error": "Credenciais inválidas ou faltando."
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

### Redefinir Senha
**POST** `/auth/change-password/`

#### Headers:
- `Authorization`: Bearer token

#### Descrição:
- Redefinir a senha do usuário autenticado.
- Todos os tipos de usuários podem usar este endpoint.


#### Body:
```json
{
  "email": "test2@gmail.com",
  "old_password": "test2password",
  "new_password": "test2",
  "confirm_password": "test2"
}
```

#### Return:

200:
```json
{
	"message": "Senha alterada com sucesso."
}

```

400:
```json
{
	"message": "Email não corresponde ao usuário autenticado."
}
```

```json
{
	"message": "Senha antiga incorreta."
}
```

```json
{
	"message": "A nova senha deve ser diferente da antiga."
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

### Resetar Senha
**POST** `/auth/password-reset/`

#### Descrição:
- Envia o código otp para o email enviado.

#### Body:
```json
{
	"email": "user@gmail.com"
}
```

#### Return:

200:
```json
{
	"message": "Se um usuário com este e-mail existir, um código OTP foi enviado."
}
```
400:
```json
{
	"email": [
		"Nenhum usuário com esse e-mail."
	]
}

```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

### Resetar Senha Confirmar
**POST** `/auth/password-reset-confirm/`

#### Descrição:
- envia o otp , o email e a nova senha.
- redefine a senha

#### Body:
```json
{
  "email": "personal@gmail.com",
  "token": "123456",
  "new_password": "usuario1!",
  "confirm_password": "ususario1!"
}
```

#### Return:

200:
```json
{
	"message": "Senha redefinida com sucesso."
}
```
400:
```json
{
	"non_field_errors": [
		"Token inválido ou expirado."
	]
}

```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```


### Listar Alunos
**GET** `/auth/personal/users/`

#### Headers:
- `Authorization`: Bearer token

#### Descrição:
- Retorna a lista de alunos do personal autenticado.
- Somente um personal pode acessar esse endpoint.


#### Return:

200:
```json
[
	{
		"id": 4,
		"username": "usuario1",
		"email": "usuario1@gmail.com",
		"phone": "123456789"
	},
	{
		"id": 5,
		"username": "usuario2",
		"email": "usuario2@gmail.com",
		"phone": "123456789"
	}
]
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

---
## Workouts

#


### Listar Treinos (Usuário)

**GET** `/workouts/list/?month=04&year=2025`

#### Headers:
- `Authorization`: Bearer token

#### Descrição:
- Retorna a lista de dias treinados e não treinados mensal do usuário autenticado.
- `month` e `year` são os parâmetros enviados na url.
#### Return:

200:
```json
{
	"diasTreinados": [
		"25-05-06",
		"25-05-05"
		
	],
	"diasNaoTreinados": [
		"25-05-07"
	]
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

#

### Listar Treinos (Personal)
**GET** `/workouts/list/?id=2&month=04&year=2025`

#### Headers:
- `Authorization`: Bearer token

#### Descrição:
- Retorna os dias treinados e não treinados mensal do aluno cujo o personal passe o `id`na url.
- Um personal so pode ver a lista de treinos do aluno que foi cadastrado por ele.

#### Return:

200:
```json
{
	"diasTreinados": [
		"25-05-06",
		"25-05-05"
		
	],
	"diasNaoTreinados": [
		"25-05-07"
	]
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
# 

###  User Details (Personal) 
**GET** `auth/users/details/?user_id=7`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
- `user_id:` usuario que deseja ver o relatório.

#### Descrição:
- Esse endpoint recebe um user_id , e retorna os dados detalhados daquele usuario .
- Um personal só pode ver os dados do aluno que ele cadastrou.

#### Return:

200:
```json
{
	"id": 7,
	"username": "usuario",
	"email": "usuario@gmail.com",
	"role": "usuario",
	"data_nascimento": "1995-08-15",
	"phone": "123456789",
	"contato_emergencia": null,
	"altura": 1.7,
	"peso": 70.5,
	"ehParticipanteDoProjeto": true,
	"fazExercicios": true
}
```


401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
404:
```json
{
	"detail": "No User matches the given query."
}
```
---

###  Treinou Hoje? 
**GET** `workouts/treinou/`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
- `user_id:` usuario que deseja ver o relatório.

#### Descrição:
- Esse endpoint retorna se o usuario autenticado treinou hoje  .

#### Return:

200:
```json
{
	"usuario_id": 2,
	"treinou_hoje": true
}
```


401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```


###  Treinou Hoje? (Personal) 
**GET** `workouts/treinou/<user_id>/aluno/`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
- `user_id:` usuario que deseja ver o relatório.

#### Descrição:
- Esse endpoint recebe um user_id , e retorna se aquele usuario treinou hoje  .
- Um personal só pode ver os dados do aluno que ele cadastrou.

#### Return:

200:
```json
{
	"usuario_id": 2,
	"treinou_hoje": true
}
```


401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
## Health

# 


### Consumo de Água  
**POST** `/health/water-intake/`

#### Headers:
- `Authorization`: Bearer 

#### Descrição:
- Registra ou atualiza o consumo diário de água do aluno autenticado.
- Apenas alunos podem registrar um consumo e água.

#### Body:
```json
{
  "date": "2025-03-09",
  "water_goal": 2000,
  "water_consumed": 1750
}
```

#### Return:

200:
```json
{
	"message": "Controle hídrico atualizado com sucesso",
	"remaining": 250,
	"isAchieved": false,
	"percentage": 87.5 //Porcentagem de quanta água foi bebida em relação à meta.
}
```


401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

403:
```json
{
	"detail": "Todos os campos são obrigatórios."
}
```

#

### Anamnese
**POST** `/health/anamnesis/`

#### Headers:
- `Authorization`: Bearer

#### Descrição:
- Registra ou atualiza a ficha de anamnese do aluno autenticado.
- Apenas alunos podem criar ou atualizar uma ficha de anamnese.

#### Body:
```json
{
  "data_nascimento": "1995-08-15",
  "profissao": "Estudante",
  "nomeDoResponsavel": "João da Silva",
  "contatoDoResponsavel": "(83) 91234-5678",
  "altura": 1.75,
  "peso": 70.5,
  "participaDeExtensao": true,
  "praticaAtividade": true,
  "boxSensacoes": ["Tontura", "Enjoo"],

  "fazDieta": true,
  "quantasRefeicoes": 4,
  "horasDeSono": 7,
  "litrosDeAgua": 2.5,

  "bebe": false,
  "fuma": false,

  "temColesterolAlto": false,
  "hdl": "45",
  "ldl": "110",

  "temTrigliceridesAlto": false,
  "diabetico": true,
  "tipoDeDiabete": ["Tipo II"],
  "descDiabete": "Diagnosticado em 2018",

  "hipertenso": false,
  "descHipertenso": "",

  "asma": false,
  "descAsma": "",

  "temProblemasRespiratorios": false,
  "descProblemasRespiratorios": "",

  "paisObesos": false,

  "jaFezCirurgia": true,
  "descCirurgia": "Apendicectomia em 2010",

  "usaMedicamento": true,
  "descMedicamento": "Metformina 850mg",

  "recomendacaoMedica": false,
  "descRestricaoMedica": "",
  "descDesconforto": "",

  "problemaDeCoracao": false,
  "doresNoPeito": false,
  "doresNoPeitoEmAtividade": false,
  "desequilibrio": false,
  "problemaOsseo": false,
  "medicamentoParaPressao": false,

  "outrasRazoes": false,
  "descOutrasRazoes": "",

  "objetivos": [
    "Perda de Peso",
    "Ganho de Força"
  ],
  "descOutro": ""
}

```

#### Return:

200:
```json
{
	"message": "Anamnese atualizada com sucesso."
}
```

201:
```json
{
	"message": "Anamnese criada com sucesso."
}
```

400:
```json
{
	"detail": "Permissão negada"
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
#

### Anamnese (Usuário)
**GET** `/health/anamnesis/`

#### Headers:
- `Authorization`: Bearer


#### Descrição:
- Retorna a ficha de anamnese do aluno autenticado.

#### Return:

200:
```json
{
  "data_nascimento": "1995-08-15",
  "profissao": "Estudante",
  "nome_completo": "João da Silva",
  "altura": 1.75,
  "peso": 70.5,
  "ehParticipanteDoProjeto": true,
  "fazExercicios": true,
  "sintomas_pos": "Mal-estar",
  "fazDieta": false,
  "medicamentos": "Nenhum",
  "doencas_cronicas": "Nenhuma",
  "cirurgia": "Apendicectomia em 2010",
  "objetivo": "Melhorar condicionamento físico"
}

```

400:
```json
{
	"detail": "Permissão negada"
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
#

### Anamnese (Personal)
**GET** `/health/anamnesis/?user_id=12`

#### Headers:
- `Authorization`: Bearer

#### Descrição:
- Retorna a ficha de anamnese do aluno cujo id foi passado na url.
- O personal autenticado só podera ver a ficha dos alunos que foram cadastrados por ele.

#### Return:

200:
```json
{
  "data_nascimento": "1995-08-15",
  "profissao": "Estudante",
  "nome_completo": "João da Silva",
  "altura": 1.75,
  "peso": 70.5,
  "ehParticipanteDoProjeto": true,
  "fazExercicios": true,
  "sintomas_pos": "Mal-estar",
  "fazDieta": false,
  "medicamentos": "Nenhum",
  "doencas_cronicas": "Nenhuma",
  "cirurgia": "Apendicectomia em 2010",
  "objetivo": "Melhorar condicionamento físico"
}

```

400:
```json
{
	"detail": "Permissão negada"
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

#


### Registro Diário
**POST** `/health/daily-record/`

#### Headers:
- `Authorization`: Bearer 

#### Descrição:
- Registra ou atualiza uma ficha diária sobre o treino do aluno autenticado.
- Apenas alunos podem registrar ou atualizar uma ficha.

#### Body:
```json
{
	"date": "2025-05-05",
	"workout": {
		"status": "done",
		"type": "Treino de Recuperação",
		"time": 50
	},
	"effort": 8,
	"rate": 4
}
```

#### Return:

201:
```json
{
	"message": "Registro diário criado ou atualizado com sucesso."
}
```

400:
```json
{
	"message": "Todos os campos são obrigatórios."
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
#

### Glicemia e Pressão
**POST** `/health/glicemia-pressao/`

#### Headers:
- `Authorization`: Bearer 

#### Descrição:
- Registra ou atualiza a pressao e glicemia do aluno autenticado.
- Apenas alunos podem registrar ou atualizar uma ficha.

#### Body:
```json
{
	"date": "2025-05-08",
  "glycemia": {
  	"pre_workout": 125,
    "post_workout": 150
 },
 "blood_pressure": {
	 "pre_workout": 100,
	 "post_workout": 200
	}
	
}
```

#### Return:

201:
```json
{
	"message": "Dados de saúde criado ou atualizado com sucesso."
}
```

400:
```json
{
	"message": "Todos os campos são obrigatórios."
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```


###  Treinamento Cogntivo
**POST** `health/game-session`

#### Headers:
- `Authorization:` Bearer <token>

#### Descrição:
- Esse endpoint salva os dados de uma sessão do jogo cognitívo do usuário autenticado no banco de dados.
- Apenas alunos podem registrar um treino cognitivo.

#### Body:

```json
{
  "date": "30-04-2025",
  "correct_answers": 7,
  "incorrect_answers": 3,
  "total_time": 28.5,
  "fastest_response": 2.1,
  "slowest_response": 6.4
}
```


#### Return:

200:
```json
{
	"detail": "Sessão registrada com sucesso!"
}
```

400:
```json
{
	"detail": "Você já registrou uma sessão para esse dia."
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
#

###  Relatório Mensal do Treinamento Cognitivo (Usuário)
**GET** `health/game-session/report/?month=04&year=2025`

#### Headers:
- `Authorization:` Bearer <token>
- `User-Agent:` insomnia/10.3.1

#### Descrição:
- Esse endpoint retorna os dados de um mês de sessões do jogo cognitívo no banco de dados.



#### Return:

200:
```json
[
	{
		"date": "2025-04-30",
		"correct_answers": 7,
		"incorrect_answers": 3,
		"total_time": 28.5,
		"fastest_response": 2.1,
		"slowest_response": 6.4
	},
	{
		"date": "2025-04-31",
		"correct_answers": 7,
		"incorrect_answers": 3,
		"total_time": 28.5,
		"fastest_response": 2.1,
		"slowest_response": 6.4
	}
]
```

400:
```json
{
	"detail": "Parâmetros 'month' e 'year' são obrigatórios."
}
```
```json
{
	"detail": "Month e Year devem ser números."
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

403:
```json
{
	"detail": "O parâmetro 'user_id' é obrigatório para personal trainers."},"
}
```
```json
{
	"detail": "Você não tem permissão para acessar este aluno.",
}
```
# 

###  Controle de Saúde 
**POST** `health/health-control/`

#### Headers:
- `Authorization:` Bearer <token>


#### Descrição:
- Esse endpoint registra o controle de saúde diário do usuário autenticado.
- Apenas alunos podem acessar este endpoint.


#### Body:

```json
{
  "date": "2025-05-08",
  "mente": {
    "insonia": 5,
    "ansiedade": 5,
    "estresse": 5,
    "falta_de_motivacao": 1,
    "dificuldade_de_concentracao": 2,
    "tristeza_frequente": 3
  },
  "cabeca": {
    "enxaqueca": 2,
    "tonturas": 1,
    "problemas_de_visao": 0,
    "zumbido_no_ouvido": 1,
    "dores_nos_olhos": 2
  },
  "corpo": {
    "dor_no_ombro": 3,
    "dor_nas_costas": 4,
    "dor_nos_joelhos": 2,
    "caibras": 1,
    "fraqueza": 0,
    "dores_articulares": 2,
    "inchaco": 1
  }
}

```

#### Return:

200:
```json
{
	"message": "Controle de saúde registrado com sucesso."
}

```

400:
```json
{
	"detalhes": "Campos obrigatórios ausentes: `<field>`"
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
# 
###  Health Control 
**GET** `health/health-control/?date=2025-05-07`

#### Headers:
- `Authorization:` Bearer <token>
- `User-Agent:` insomnia/10.3.1

#### Parâmetros:
- `date:` data que deseja ver o relatório.

#### Descrição:
- Esse endpoint recebe uma data , e retorna o controle de saúde do usuário autenticado naquela data .
- Apenas alunos podem receber o controle de saúde diário.

#### Return:

200:
```json
{
	"usuario": "usuario",
	"date": "2025-05-08",
	"mente": {
		"insonia": 5,
		"ansiedade": 5,
		"estresse": 5,
		"falta_de_motivacao": 1,
		"dificuldade_de_concentracao": 2,
		"tristeza_frequente": 3
	},
	"cabeca": {
		"enxaqueca": 2,
		"tonturas": 1,
		"problemas_de_visao": 0,
		"zumbido_no_ouvido": 1,
		"dores_nos_olhos": 2
	},
	"corpo": {
		"dor_no_ombro": 3,
		"dor_nas_costas": 4,
		"dor_nos_joelhos": 2,
		"caibras": 1,
		"fraqueza": 0,
		"dores_articulares": 2,
		"inchaco": 1
	}
}
```


401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
# 

###  Relatório de Saúde (Personal) 
**GET** `health/health-summary/?user_id=7&year=2025&month=05`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
- `user_id:` usuario que deseja ver o relatório.
- `yead:` Ano que deseja ver o relatório.
- `month:` Mês que deseja ver o relatório.


#### Descrição:
- Esse endpoint recebe uma ano e mês , e retorna o relatório do controle de saúde do usuário naquele mês .
- O personal so pode ver o reltório dos alunos que foram cadastrados por ele.
#### Return:

200:
```json
{
	"usuario": "usuario",
	"ano": "2025",
	"mes": "05",
	"mente": {
		"insonia": 3.75,
		"ansiedade": 2.75,
		"estresse": 4.25,
		"falta_de_motivacao": 1,
		"dificuldade_de_concentracao": 2,
		"tristeza_frequente": 3
	},
	"cabeca": {
		"enxaqueca": 2,
		"tonturas": 1,
		"problemas_de_visao": 0,
		"zumbido_no_ouvido": 1,
		"dores_nos_olhos": 2
	},
	"corpo": {
		"dor_no_ombro": 3,
		"dor_nas_costas": 4,
		"dor_nos_joelhos": 2,
		"caibras": 1,
		"fraqueza": 0,
		"dores_articulares": 2,
		"inchaco": 1
	}
}
```


401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```
#

---
## Notify

#

### Registrar Dispositivo
**POST** `notify/register-device/`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
- `fcm_token:` Token FCM gerado pela autorização de notificação do dispositivo.

#### Descrição:
Esse endpoint recebe o Token FCM do dispositivo e registra no servidor firebase para o dispositivo receber as notificações.

#### Body:

```json
{
  "fcm_token": "12345456789abcdefghij"
}
```


#### Return:

200:
```json
{
	"message": "Token registrado"
}
```

400:
```json
{
	"error": "Token ausente"
}
```

401:
```json
{
	"detail": "O token informado não é válido para qualquer tipo de token",
	"code": "token_not_valid",
	"messages": [
		{
			"token_class": "AccessToken",
			"token_type": "access",
			"message": "O token é inválido ou expirado"
		}
	]
}
```

--- 

---
## Graphics
# 




### Gráfico de Tempo de treino
**GET** `graphics/training-time/?user_id=7`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
- `user_id:` (opcional) ID do usuário para personal trainers. Usuários comuns não precisam informar.

#### Descrição:
Retorna os treinos concluídos por mês, agrupados por dia, com o tempo gasto (time) em cada treino.

#### Return:
200:

```json
{
	"janeiro": [],
	"fevereiro": [],
	"março": [],
	"abril": [],
	"maio": [
		{
			"value": 50,
			"label": "05"
		},
		{
			"value": 35,
			"label": "06"
		},
		
		
	],
	"junho": [],
	"julho": [],
	"agosto": [],
	"setembro": [],
	"outubro": [],
	"novembro": [],
	"dezembro": []
}
```
#

### Gráfico de Percepção de esforcço
**GET** `graphics/effort/?user_id=7`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
`user_id:` (opcional) ID do usuário para personal trainers.

#### Descrição:
Retorna o esforço autoavaliado (effort) nos treinos de 0 a 10, agrupado por mês e dia.

#### Return:
```json
{
  "abril": [
    { "value": 7, "label": "03" },
    { "value": 9, "label": "10" }
  ],
  ...
}
```
#

### Gráfico de Satisfação de treino
**GET** `graphics/rate/?user_id=7`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
`user_id:` (opcional) ID do usuário para personal trainers.

#### Descrição:
Retorna a nota de satisfação (rate) do usuário com o treino, de 1 a 5, agrupada por mês e dia.

#### Return:
```json
{
  "maio": [
    { "value": 5, "label": "01" },
    { "value": 4, "label": "04" }
  ]
}
```
#

### Gráfico de Saúde Mental / Física / Cabeça
**GET** `graphics/health/<field_name>/<group>/<user_id>`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:
- `field_name:` Campo desejado para o gráfico (ex: estresse, dor_nas_costas, enxaqueca, etc.)

- `group:` Grupo do campo (mente, cabeca, corpo)

- `user_id:` (opcional) para personal trainers

#### Descrição:
Retorna o nível reportado para o campo selecionado no HealthControlModel, agrupado por mês e dia.

#### Return:
```json
{
  "fevereiro": [
    { "value": 3, "label": "08" },
    { "value": 6, "label": "15" }
  ],
  ...
}
```

#


### Gráfico de Glicemia
**GET** `graphics/glycemia/<user_id>/`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:

- `user_id:` (opcional) para personal trainers

#### Descrição:
Retorna o nível reportado para o campo selecionado no GlycemiaModel, agrupado por mês e dia.

#### Return:
```json
{
  "maio": [
    { "label": "03", "pre": 87, "post": 95 },
    { "label": "05", "pre": 84, "post": 90 }
  ],
  "junho": [
    { "label": "01", "pre": 88, "post": 91 },
    { "label": "04", "pre": 86, "post": 89 }
  ]
  ...
}

```
#

### Gráfico de Pressão Sanguínea 
**GET**  `graphics/blood-pressure/<user_id>/`

#### Headers:
- `Authorization:` Bearer <token>

#### Parâmetros:

- `user_id:` (opcional) para personal trainers

#### Descrição:
Retorna o nível reportado para o campo selecionado no GlycemiaModel, agrupado por mês e dia.

#### Return:
```json
{
  "maio": [
    { "label": "03", "pre": 87, "post": 95 },
    { "label": "05", "pre": 84, "post": 90 }
  ],
  "junho": [
    { "label": "01", "pre": 88, "post": 91 },
    { "label": "04", "pre": 86, "post": 89 }
  ]
  ...
}

```
