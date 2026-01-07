import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from "./components/WhatsAppButton";
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventManagerPage from './pages/EventManagerPage';
import EventRequestPage from './pages/EventRequestPage';
import EventRequestsPage from './pages/EventRequestsPage';
import LoginPage from './pages/LoginPage';
import './i18n';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/eventos" element={<EventsPage />} />
            <Route path="/solicitar-evento" element={<EventRequestPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
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
        </main>
        <Footer />
        <WhatsAppButton />
      </Router>
    </AuthProvider>
  );
}

export default App;
