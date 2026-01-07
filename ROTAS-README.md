# Sistema de Rotas - CVB Campina Grande

## 📍 Rotas Disponíveis

### `/` - Página Inicial (HomePage)
Página principal do site com todas as seções:
- Hero
- Quem Somos
- O Que Fazemos
- Diretoria
- Eventos em Destaque (carousel)
- Associados
- Parcerias Governamentais
- Contato

### `/eventos` - Página de Eventos (EventsPage)
Página dedicada para visualização completa de eventos:
- Hero section com título
- Filtros de busca, categoria e mês
- Lista de todos os eventos agrupados por mês
- Cards com altura fixa (450px) e layout responsivo

## 🧭 Navegação

### Header
O Header foi atualizado para funcionar com React Router:

**Comportamento:**
- Se estiver na página inicial (`/`): scroll suave para seção
- Se estiver em outra página: navega para home e depois faz scroll

**Implementação:**
```tsx
const handleNavClick = (id: string) => {
  if (location.pathname !== '/') {
    navigate('/');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
};
```

### Links entre Páginas

**De HomePage para EventsPage:**
```tsx
<Link to="/eventos">Ver Todos os Eventos</Link>
```

**De EventsPage para HomePage:**
```tsx
<Link to="/">Voltar</Link>
```

## 🎯 IDs de Seções (para scroll)

Use estes IDs em `href="#id"` ou `scrollIntoView`:

- `#inicio` - Hero
- `#quem-somos` - WhoWeAre
- `#o-que-fazemos` - WhatWeDo
- `#diretoria` - Board
- `#eventos` - Events (carousel)
- `#associados` - Associates
- `#parcerias` - GovernmentPartnerships
- `#contato` - Contact

## 📱 Responsividade

### HomePage
- Desktop: Todas as seções visíveis
- Mobile: Layout adaptativo com menu hamburguer

### EventsPage
- Desktop: Grid 3 colunas
- Tablet: Grid 2 colunas
- Mobile: Grid 1 coluna

## 🔄 Estrutura de Arquivos

```
src/
├── App.tsx              # Router principal
├── pages/
│   ├── HomePage.tsx     # Página inicial
│   └── EventsPage.tsx   # Página de eventos
└── components/
    ├── Header.tsx       # Navegação com rotas
    ├── Events.tsx       # Carousel de eventos
    └── ...              # Outros componentes
```

## 🚀 Como Adicionar Nova Rota

1. **Criar componente da página:**
```tsx
// src/pages/NovaPage.tsx
const NovaPage = () => {
  return <div>Conteúdo</div>;
};
export default NovaPage;
```

2. **Adicionar rota em App.tsx:**
```tsx
import NovaPage from './pages/NovaPage';

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/eventos" element={<EventsPage />} />
  <Route path="/nova" element={<NovaPage />} />
</Routes>
```

3. **Adicionar link de navegação:**
```tsx
<Link to="/nova">Ir para Nova Página</Link>
```

## ⚙️ Configuração

O Router está configurado em `App.tsx`:

```tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router>
  <Header />
  <main>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/eventos" element={<EventsPage />} />
    </Routes>
  </main>
  <Footer />
  <WhatsAppButton />
</Router>
```

**Componentes fixos (fora de Routes):**
- Header (sempre visível)
- Footer (sempre visível)
- WhatsAppButton (sempre visível)

**Componentes dinâmicos (dentro de Routes):**
- HomePage
- EventsPage

## 🔧 Troubleshooting

### Link não funciona
- Verifique se usou `<Link to="">` e não `<a href="">`
- Certifique-se que o Router está envolvendo o componente

### Scroll não funciona
- Verifique se o ID da seção existe
- Confirme que está na HomePage antes de scrollar
- Use `handleNavClick` do Header como exemplo

### Página em branco
- Verifique console do navegador para erros
- Confirme que a rota está em `<Routes>`
- Verifique se o componente está sendo exportado corretamente
