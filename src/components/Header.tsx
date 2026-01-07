import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo_cvbcg.svg";
import { useTranslation } from "react-i18next";
import { Globe, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { t, i18n } = useTranslation("header");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { id: "inicio", label: t("menu.inicio") },
    { id: "quem-somos", label: t("menu.quemSomos") },
    { id: "o-que-fazemos", label: t("menu.oQueFazemos") },
    { id: "diretoria", label: t("menu.diretoria") },
    { id: "eventos", label: t("menu.eventos") },
    { id: "associados", label: t("menu.associados") },
    { id: "parcerias", label: t("menu.parcerias") },
    { id: "contato", label: t("menu.contato") },
  ];

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex w-full items-center justify-between px-4 md:px-6 lg:px-12 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt={t("logoAlt")} className="h-10 md:h-12 w-auto" />
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-bold leading-tight text-slate-900">CAMPINA GRANDE</span>
            <span className="text-xs font-medium leading-tight text-slate-600">CONVENTION & VISITORS BUREAU</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-500"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
              title="Sair da conta de administrador"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          )}

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-500 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
              aria-label="Selecionar idioma"
              aria-expanded={isLanguageOpen}
            >
              <Globe className="h-5 w-5" />
              <span className="hidden sm:inline">Idioma</span>
            </button>

            {isLanguageOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 flex flex-col gap-1 bg-white border border-slate-100 rounded-lg p-2 shadow-xl z-50">
                <button
                  onClick={() => {
                    i18n.changeLanguage("pt");
                    setIsLanguageOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors w-full text-left"
                >
                  <img src="/bandeiras/brasil.svg" alt="Português" className="h-5 w-5 object-cover rounded-full" />
                  Português
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage("en");
                    setIsLanguageOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors w-full text-left"
                >
                  <img src="/bandeiras/eua.svg" alt="English" className="h-5 w-5 object-cover rounded-full" />
                  English
                </button>
                <button
                  onClick={() => {
                    i18n.changeLanguage("es");
                    setIsLanguageOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors w-full text-left"
                >
                  <img src="/bandeiras/espanha.svg" alt="Español" className="h-5 w-5 object-cover rounded-full" />
                  Español
                </button>
              </div>
            )}
          </div>

          <button 
            className="lg:hidden text-slate-600 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col p-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="py-3 text-base font-medium text-slate-600 hover:text-emerald-500 border-b border-slate-50 last:border-0 text-left w-full"
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="py-3 text-base font-medium text-red-600 hover:text-red-700 border-b border-slate-50 last:border-0 text-left w-full flex items-center gap-2"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
