# CVB Campina Grande - Website Oficial

Site institucional do Convention & Visitors Bureau de Campina Grande, desenvolvido com React, TypeScript, Vite e Firebase.

## 🚀 Tecnologias

- React 19 + TypeScript
- Vite (build tool)
- Firebase (Auth, Firestore, Storage)
- React Router v6
- Tailwind CSS
- i18next (internacionalização - PT, EN, ES)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Firebase (para configuração)

## ⚙️ Configuração Inicial

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd cvb-cg
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

Edite `.env.local` e preencha com suas credenciais do Firebase:

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Configurações do Projeto** > **Geral**
4. Role até **Seus apps** e copie as credenciais
5. Cole no arquivo `.env.local`

### 4. Configure o Firebase

No Firebase Console, ative:
- **Authentication** → Email/Password
- **Firestore Database** → Modo produção
- **Storage** → Modo produção

### 5. Crie um usuário admin

No Firebase Console:
- **Authentication** > **Users** > **Add user**
- Cadastre email e senha para acesso admin

## 🏃 Executando o projeto

### Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:5173

### Build para produção
```bash
npm run build
```

### Preview da build
```bash
npm run preview
```

## 🔐 Rotas Protegidas

Rotas administrativas (requerem autenticação):
- `/admin/eventos` - Gerenciar eventos
- `/admin/solicitacoes` - Ver solicitações pendentes

## 📧 Backend de Email (Opcional)

Para notificações por email, configure o backend separado:
```bash
cd ../api
npm install
npm start
```

O backend roda em `http://localhost:3000` (configurado em `VITE_API_URL`)
