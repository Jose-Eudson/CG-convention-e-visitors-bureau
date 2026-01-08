# 🛠️ Stack Tecnológica - CVB Campina Grande

## 📱 Frontend

### Core
- **Vite** v7.2.4 - Build tool e dev server
- **React** v19.2.0 - Biblioteca UI
- **TypeScript** v5.9.3 - Linguagem com tipagem estática
- **Tailwind CSS** v3.4.18 - Framework CSS utility-first
  - @tailwindcss/vite v4.1.17

### Roteamento
- **React Router DOM** v7.11.0 - Navegação SPA

### Internacionalização
- **i18next** v25.7.1 - Framework i18n
- **react-i18next** v16.3.5 - React bindings
- **i18next-http-backend** v3.0.2 - Carregar traduções
- **i18next-browser-languagedetector** v8.2.0 - Detectar idioma

### UI Components
- **Lucide React** v0.555.0 - Ícones
- **React Slick** v0.31.0 - Carrossel de imagens
- **Slick Carousel** v1.8.1 - CSS do carrossel

### Backend as Service
- **Firebase** v12.7.0
  - Firestore Database
  - Firebase Storage
  - Firebase Authentication (preparado)

## 🔧 Backend (API de Emails)

### Core
- **Node.js** - Runtime JavaScript
- **Express** v4.18.2 - Framework web
- **Nodemailer** v6.9.7 - Envio de emails via SMTP

### Utilitários
- **CORS** v2.8.5 - Cross-Origin Resource Sharing
- **dotenv** v16.3.1 - Variáveis de ambiente

### Dev Tools
- **Nodemon** v3.0.2 - Auto-restart em desenvolvimento

## 📦 Estrutura do Projeto

```
cvb-cg/                          # Frontend (React + Vite)
├── src/
│   ├── components/             # Componentes React
│   ├── pages/                  # Páginas/Rotas
│   ├── services/               # Serviços (Firebase, API)
│   ├── types/                  # TypeScript types
│   ├── lib/                    # Configurações (Firebase)
│   └── assets/                 # Imagens, logos
├── public/
│   └── locales/                # Traduções (pt, en, es)
└── package.json

cvb-cg-api/                     # Backend (Node.js + Express)
├── index.js                    # Servidor Express
├── .env                        # Credenciais Gmail
└── package.json
```

## 🎯 Funcionalidades Implementadas

### Frontend
- ✅ Sistema de rotas (React Router)
- ✅ Internacionalização (PT, EN, ES)
- ✅ Gerenciamento de eventos (CRUD)
- ✅ Upload de imagens (Firebase Storage)
- ✅ Sistema de solicitações públicas
- ✅ Painel administrativo
- ✅ Carrossel de eventos em destaque
- ✅ Filtros e busca de eventos
- ✅ Design responsivo (Tailwind)

### Backend
- ✅ API REST para emails
- ✅ Notificações para admin
- ✅ Confirmações para solicitantes
- ✅ Emails de aprovação/rejeição
- ✅ Templates HTML personalizados
- ✅ SMTP via Gmail (gratuito)

## 🚀 Hospedagem

### Frontend
- **Opções:** Vercel, Netlify, Firebase Hosting
- **Custo:** Gratuito

### Backend
- **Opções:** Vercel Serverless, Render, Railway
- **Custo:** Gratuito (com limites)

### Banco de Dados
- **Firebase Firestore** - Gratuito até 50k reads/dia
- **Firebase Storage** - 5GB gratuito

## 📊 Desempenho

- **Bundle Size:** ~500KB (gzipped)
- **First Load:** ~1.5s
- **Time to Interactive:** ~2s
- **Lighthouse Score:** 90+

## 🔐 Segurança

- Firestore Security Rules configuradas
- Validação de dados no frontend e backend
- CORS habilitado apenas para origins permitidas
- Variáveis de ambiente para credenciais

## 📝 Comandos Úteis

### Frontend
```bash
npm run dev      # Rodar em desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
```

### Backend
```bash
npm run dev      # Rodar com nodemon
npm start        # Rodar em produção
```

## 🔄 Próximas Melhorias Sugeridas

- [ ] Firebase Authentication (login admin)
- [ ] Dashboard com analytics
- [ ] Exportação de dados (CSV, PDF)
- [ ] Sistema de notificações push
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
