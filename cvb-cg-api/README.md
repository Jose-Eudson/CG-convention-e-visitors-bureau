# 📧 CVB Campina Grande - API de Emails

Backend simples para envio de emails do sistema CVB.

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Criar Senha de App do Gmail

1. Acesse: https://myaccount.google.com/apppasswords
2. Nome do app: "CVB Campina Grande"
3. Copie a senha gerada (16 caracteres)

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env`:

```env
EMAIL_USER=eudsoncordeiro31@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=eudsoncordeiro31@gmail.com
PORT=3000
```

### 4. Rodar Localmente

```bash
npm run dev
```

Servidor rodando em: http://localhost:3000

## 📡 Rotas da API

### POST /api/send-admin-notification
Envia email para o admin quando há nova solicitação.

**Body:**
```json
{
  "title": "Evento Teste",
  "description": "Descrição",
  "date": "2026-03-15",
  "location": "Campina Grande",
  "category": "Conferência",
  "submitterName": "João",
  "submitterEmail": "joao@email.com"
}
```

### POST /api/send-confirmation
Envia confirmação para o solicitante.

### POST /api/send-approval
Envia email de aprovação para o solicitante.

### POST /api/send-rejection
Envia email de rejeição para o solicitante.

## 🌐 Deploy no Vercel (GRÁTIS)

1. Instale o Vercel CLI:
```bash
npm i -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Configure as variáveis de ambiente no painel da Vercel

5. Sua API estará em: https://seu-projeto.vercel.app

## 🔧 Próximos Passos

Depois de fazer deploy, atualize o frontend para usar a URL da API:

```typescript
const API_URL = 'https://seu-projeto.vercel.app';
```
