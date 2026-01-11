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
cd ../cvb-cg-api
npm install
npm start
```

O backend roda em `http://localhost:3000` (configurado em `VITE_API_URL`)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
