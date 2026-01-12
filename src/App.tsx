import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AdicionarEmpresa from "./components/add";
import "./index.css";
import "./i18n";

import { AuthProvider } from "./contexts/AuthContext";

import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ConhecaCampinaGrande from "./pages/ConhecaCampinaGrande";
import EventsPage from "./pages/EventsPage";
import EventManagerPage from "./pages/EventManagerPage";
import EventRequestPage from "./pages/EventRequestPage";
import EventRequestsPage from "./pages/EventRequestsPage";
import LoginPage from "./pages/LoginPage";

import FormularioAssoc from "./components/form";

/* Página de proposta / formulário */
function PropostaPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-20 bg-slate-50 min-h-screen">
      <FormularioAssoc />
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />

      <div className="min-h-screen bg-slate-50 scroll-smooth">
        <Header />

        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/conheca" element={<ConhecaCampinaGrande />} />
          <Route path="/proposta" element={<PropostaPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/solicitar-evento" element={<EventRequestPage />} />
          <Route path="/admin/login" element={<LoginPage />} />

          {/* --- NOVA ROTA ADICIONADA AQUI --- */}
          <Route
            path="/admin/adicionar"
            element={
              <>
                <Header />
                <AdicionarEmpresa />
                <Footer />
              </>
            }
          />

          {/* Protegidas */}
          <Route
            path="/admin/eventos"
            element={
              <ProtectedRoute>
                <EventManagerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/solicitacoes"
            element={
              <ProtectedRoute>
                <EventRequestsPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
        <WhatsAppButton />
      </div>
    </AuthProvider>
  );
}
