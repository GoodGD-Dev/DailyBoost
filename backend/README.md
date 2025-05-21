# Backend de Autenticação

Uma API RESTful completa para autenticação de usuários, construída com Node.js, Express e MongoDB.

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Dockerização](#dockerização)
- [Segurança](#segurança)
- [Boas Práticas](#boas-práticas)

## Visão Geral

Este projeto implementa um sistema de autenticação robusto com funcionalidades completas, incluindo registro de usuário, verificação de email, login tradicional, autenticação OAuth com Google, recuperação de senha, e mais. Foi desenvolvido seguindo padrões de arquitetura moderna e práticas de desenvolvimento seguro.

## Funcionalidades

- 🔐 **Registro e Login**: Sistema completo de registro e autenticação
- ✉️ **Verificação de Email**: Verificação obrigatória de email para novos usuários
- 🔑 **Recuperação de Senha**: Fluxo seguro para redefinição de senha
- 🌐 **Autenticação OAuth**: Login com Google integrado com Firebase
- 🔒 **JWT e Cookies Seguros**: Sistema seguro de tokens e cookies
- 🔍 **Proteção de Rotas**: Middleware de autorização para rotas protegidas
- 🛡️ **Tratamento de Erros**: Sistema global e consistente de tratamento de erros
- 📊 **Health Check**: Endpoint para monitoramento da API

## Tecnologias

- **Node.js**: Plataforma de execução JavaScript
- **Express**: Framework web para APIs
- **MongoDB & Mongoose**: Banco de dados e ODM
- **JWT**: Tokens para autenticação
- **bcryptjs**: Criptografia de senhas
- **nodemailer**: Envio de emails
- **Firebase Admin**: Autenticação com Google
- **dotenv**: Gerenciamento de variáveis de ambiente
- **cors**: Configuração de Cross-Origin Resource Sharing
- **Docker**: Containerização da aplicação

## Estrutura do Projeto

```
/backend
├── src/
│   ├── app.js                  - Configuração do Express
│   ├── server.js               - Ponto de entrada da aplicação
│   ├── config/                 - Configurações
│   │   ├── index.js            - Exportação centralizada
│   │   ├── database.js         - Configuração do MongoDB
│   │   └── firebase.js         - Configuração do Firebase
│   ├── features/               - Organização por funcionalidade
│   │   └── auth/               - Módulo de autenticação
│   │       ├── auth.controller.js - Controladores
│   │       ├── auth.middleware.js - Middlewares
│   │       ├── auth.model.js      - Modelo de usuário
│   │       ├── auth.routes.js     - Rotas
│   │       └── auth.service.js    - Serviços
│   ├── middlewares/            - Middlewares globais
│   │   └── error.middleware.js - Tratamento de erros
│   └── utils/                  - Utilitários
│       ├── email.utils.js      - Serviço de email
│       └── jwt.utils.js        - Utilitários JWT
├── .env                        - Variáveis de ambiente
├── .env.example                - Exemplo de variáveis de ambiente
├── Dockerfile                  - Configuração do Docker
├── package.json                - Dependências e scripts
└── README.md                   - Documentação
```

## Instalação

### Pré-requisitos

- Node.js 18 ou superior
- MongoDB (local ou remoto)
- Conta Firebase (para autenticação Google)
- Conta de email para envio de emails

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/GoodGD-Dev/DailyBoost
   cd DailyBoost
   cd backend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

Para desenvolvimento:

```bash
npm run dev
```

## Configuração

Crie um arquivo `.env` baseado no `.env.example` e configure as seguintes variáveis:

### Servidor e Banco de Dados

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://username:password@yourcluster.mongodb.net/database-name
```

### Autenticação

```
JWT_SECRET=sua_chave_secreta_muito_longa_e_complexa
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Email

```
EMAIL_SERVICE=gmail
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-app
EMAIL_FROM_NAME=Nome da Aplicação
# EMAIL_TEST_MODE=true  # Para ambiente de desenvolvimento
```

### Firebase (para login Google)

```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=seu-projeto-id
# Outras configurações do Firebase...
```

## Uso

### Fluxo de autenticação básico

1. **Registro**: Um novo usuário se registra com nome, email e senha
2. **Verificação**: O usuário recebe um email com link de verificação
3. **Login**: Após verificar o email, o usuário pode fazer login
4. **Token**: O sistema gera um token JWT armazenado em cookie HttpOnly
5. **Acesso**: O token permite acesso às rotas protegidas
6. **Logout**: O cookie com o token é invalidado

## API Endpoints

### Rotas Públicas

- **POST /api/auth/register**

  - Registra um novo usuário
  - Corpo: `{ "name": "Nome", "email": "email@exemplo.com", "password": "senha" }`

- **POST /api/auth/login**

  - Autentica um usuário
  - Corpo: `{ "email": "email@exemplo.com", "password": "senha" }`

- **POST /api/auth/google**

  - Login com Google (OAuth)
  - Corpo: `{ "idToken": "token-do-google" }`

- **GET /api/auth/verify-email/:token**

  - Verifica o email do usuário usando o token enviado por email

- **POST /api/auth/resend-verification**

  - Reenvia o email de verificação
  - Corpo: `{ "email": "email@exemplo.com" }`

- **POST /api/auth/forgot-password**

  - Inicia o fluxo de recuperação de senha
  - Corpo: `{ "email": "email@exemplo.com" }`

- **PUT /api/auth/reset-password/:token**
  - Redefine a senha usando o token recebido por email
  - Corpo: `{ "password": "nova-senha" }`

### Rotas Protegidas

- **GET /api/auth/me**

  - Retorna dados do usuário atual (requer autenticação)

- **GET /api/auth/logout**
  - Realiza logout do usuário (requer autenticação)

### Rota de Status

- **GET /api/health**
  - Verifica o status da API e retorna informações sobre o ambiente

## Dockerização

O projeto inclui um Dockerfile para containerização:

```bash
# Construir a imagem
docker build -t auth-backend .

# Executar o container
docker run -p 5000:5000 --env-file .env auth-backend
```

## Segurança

- **Senhas**: Armazenadas com hash usando bcrypt
- **Tokens**: JWTs armazenados em cookies HttpOnly
- **Cookies**: Configurados com opções Secure e SameSite
- **CORS**: Configurado para permitir apenas origens específicas
- **Verificação de Email**: Prevenção contra contas falsas
- **Limitação de Tentativas**: Proteção contra ataques de força bruta

## Boas Práticas

### Implementadas neste projeto

1. **Arquitetura Modular**: Organização por features para melhor manutenção
2. **Separação de Responsabilidades**: Controllers, Services, Models, Routes
3. **Tratamento Centralizado de Erros**: Middleware global para erros
4. **Validação de Dados**: Verificação rigorosa de entradas do usuário
5. **Segurança por Design**: Práticas de segurança implementadas desde o início
6. **Configuração Flexível**: Uso de variáveis de ambiente
7. **Logs Informativos**: Registros para depuração e monitoramento
8. **Mensagens de Erro Amigáveis**: Feedback útil para usuários e desenvolvedores

---

## Contribuições

Contribuições são bem-vindas! Por favor, sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

Copyright (c) 2025 Dionatha Goulart
