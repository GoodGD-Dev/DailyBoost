# Frontend de Autenticação - DailyBoost

Uma aplicação web moderna e responsiva para autenticação de usuários, construída com React e integrada ao backend de autenticação.

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Componentes Principais](#componentes-principais)
- [Páginas](#páginas)
- [Integração com Backend](#integração-com-backend)
- [Deploy](#deploy)
- [Boas Práticas](#boas-práticas)

## Visão Geral

Este projeto implementa uma interface de usuário moderna e intuitiva para o sistema de autenticação DailyBoost. A aplicação oferece uma experiência fluida com design responsivo, validação em tempo real, feedback visual e integração completa com todas as funcionalidades do backend de autenticação.

## Funcionalidades

- 🎨 **Interface Moderna**: Design clean e responsivo com componentes reutilizáveis
- 🔐 **Autenticação Completa**: Telas de registro, login, verificação e recuperação
- 🌐 **Login com Google**: Integração OAuth com Firebase
- ✉️ **Verificação de Email**: Interface para confirmação de email
- 🔑 **Recuperação de Senha**: Fluxo completo de redefinição de senha
- 🔒 **Rotas Protegidas**: Sistema de navegação baseado em autenticação
- 📱 **Responsivo**: Otimizado para desktop, tablet e mobile
- ⚡ **Validação em Tempo Real**: Feedback instantâneo em formulários
- 🎯 **Estado Global**: Gerenciamento eficiente do estado de autenticação
- 🔄 **Loading States**: Indicadores visuais para operações assíncronas

## Tecnologias

- **React 18**: Biblioteca principal para construção da interface
- **Vite**: Build tool e dev server otimizado
- **React Router DOM**: Roteamento e navegação
- **Axios**: Cliente HTTP para comunicação com API
- **React Hook Form**: Gerenciamento eficiente de formulários
- **Yup**: Validação de esquemas
- **Context API**: Gerenciamento de estado global
- **CSS Modules/Styled Components**: Estilização modular
- **Firebase SDK**: Integração com autenticação Google
- **React Hot Toast**: Notificações elegantes
- **Lucide React**: Ícones modernos

## Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Backend da aplicação rodando
- Projeto Firebase configurado

### Passos

1. Clone o repositório:

    ```bash
    git clone https://github.com/GoodGD-Dev/DailyBoost
    cd DailyBoost
    cd frontend
    ```

2. Instale as dependências:

    ```bash
    npm install
    # ou
    yarn install
    ```

3. Configure as variáveis de ambiente:

    ```bash
    cp .env.example .env
    # Edite o arquivo .env com suas configurações
    ```

4. Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    # ou
    yarn dev
    ```

A aplicação estará disponível em `http://localhost:5173`

## Configuração

Crie um arquivo `.env` baseado no `.env.example`:

### API e Backend

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DailyBoost
```

### Firebase (para login Google)

```
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Ambiente

```
VITE_NODE_ENV=development
```

## Uso

### Fluxo de usuário principal

1. **Página Inicial**: Apresentação da aplicação com opções de login/registro
2. **Registro**: Formulário com validação em tempo real
3. **Verificação**: Tela informativa sobre verificação de email
4. **Login**: Autenticação tradicional ou com Google
5. **Dashboard**: Área restrita após autenticação bem-sucedida
6. **Perfil**: Gerenciamento de dados do usuário

### Funcionalidades específicas

- **Validação em Tempo Real**: Feedback instantâneo em todos os formulários
- **Estado de Loading**: Indicadores visuais durante operações
- **Notificações**: Toast messages para feedback de ações
- **Redirecionamento Inteligente**: Navegação baseada no estado de autenticação
- **Persistência de Sessão**: Mantém usuário logado entre sessões

## Componentes Principais

### AuthContext

Gerencia o estado global de autenticação:

```jsx
const { user, login, logout, loading, isAuthenticated } = useAuth()
```

### ProtectedRoute

Componente para proteção de rotas:

```jsx
<ProtectedRoute>
    <Dashboard />
</ProtectedRoute>
```

### Formulários

Componentes com validação integrada:

- **LoginForm**: Login tradicional e OAuth
- **RegisterForm**: Registro com validação completa
- **ResetPasswordForm**: Redefinição de senha

## Páginas

### Autenticação

- **/login**: Página de login com opções tradicionais e Google
- **/register**: Registro de novos usuários
- **/verify-email**: Informações sobre verificação de email
- **/forgot-password**: Solicitação de recuperação de senha
- **/reset-password/:token**: Redefinição de senha com token

### Aplicação

- **/**: Página inicial pública
- **/dashboard**: Painel do usuário autenticado
- **/profile**: Perfil e configurações do usuário

## Integração com Backend

### Serviços de API

A aplicação consome os seguintes endpoints do backend:

- **POST /api/auth/register**: Registro de usuário
- **POST /api/auth/login**: Login tradicional
- **POST /api/auth/google**: Autenticação Google
- **GET /api/auth/me**: Dados do usuário atual
- **POST /api/auth/forgot-password**: Recuperação de senha
- **PUT /api/auth/reset-password/:token**: Redefinir senha
- **GET /api/auth/verify-email/:token**: Verificar email
- **GET /api/auth/logout**: Logout do usuário

### Interceptadores

- **Requisições**: Adiciona automaticamente tokens de autenticação
- **Respostas**: Trata erros globalmente e redireciona quando necessário

## Deploy

### Build de Produção

```bash
npm run build
# ou
yarn build
```

### Variáveis para Produção

Atualize o `.env` com URLs de produção:

```
VITE_API_URL=https://sua-api.herokuapp.com/api
```

### Plataformas Sugeridas

- **Vercel**: Deploy automático via Git
- **Netlify**: Integração contínua
- **Heroku**: Deploy com containers
- **AWS S3 + CloudFront**: Hospedagem estática

## Boas Práticas

### Implementadas

1. **Componentização**: Componentes pequenos e reutilizáveis
2. **Hooks Customizados**: Lógica reutilizável e testável
3. **Validação Robusta**: Validação client-side e server-side
4. **Tratamento de Erros**: Feedback claro para usuários
5. **Acessibilidade**: Componentes acessíveis por padrão
6. **Performance**: Lazy loading e otimizações
7. **SEO**: Meta tags e estrutura semântica
8. **Responsividade**: Design mobile-first

### Segurança

- Tokens armazenados de forma segura
- Validação de entrada em todos os formulários
- Sanitização de dados
- Proteção contra XSS
- HTTPS obrigatório em produção

---

## Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview do build
npm run lint       # Análise de código
npm run test       # Executar testes
```

## Contribuições

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## Licença

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

Copyright (c) 2025 Dionatha Goulart
