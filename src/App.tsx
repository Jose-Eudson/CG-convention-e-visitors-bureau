import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import './i18n';


import Header from './components/Header';
import Hero from './components/Hero';
import WhoWeAre from './components/WhoWeAre';
import WhatWeDo from './components/WhatWeDo';
import Board from './components/Board';
import Events from './components/Events';
import Associates from './components/Associates';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';

import Ol from './components/Ol';
import HeaderProposta from './components/HeaderProposta';
import FooterSimples from './components/FooterSimples';

import EventsPage from './pages/EventsPage';
import EventManagerPage from './pages/EventManagerPage';
import EventRequestPage from './pages/EventRequestPage';
import EventRequestsPage from './pages/EventRequestsPage';
import LoginPage from './pages/LoginPage';


function HomePage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section id="inicio"><Hero /></section>
        <section id="quem-somos"><WhoWeAre /></section>
        <section id="o-que-fazemos"><WhatWeDo /></section>
        <section id="diretoria"><Board /></section>
        <section id="eventos"><Events /></section>
        <section id="associados"><Associates /></section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}


function PropostaPage() {
  return (
    <>
      <HeaderProposta />
      <div className="pt-16">
        <Ol />
      </div>
      <FooterSimples />
      <WhatsAppButton />
    </>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 scroll-smooth">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/proposta" element={<PropostaPage />} />
            <Route path="/eventos" element={<><Header /><EventsPage /><Footer /></>} />
            <Route path="/solicitar-evento" element={<><Header /><EventRequestPage /><Footer /></>} />
            <Route path="/admin/login" element={<LoginPage />} />
            
            <Route 
              path="/admin/eventos" 
              element={
                <ProtectedRoute>
                  <Header />
                  <EventManagerPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/solicitacoes" 
              element={
                <ProtectedRoute>
                  <Header />
                  <EventRequestsPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}