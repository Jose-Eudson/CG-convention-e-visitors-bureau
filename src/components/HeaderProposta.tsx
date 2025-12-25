import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo_cvbcg.svg";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const HeaderProposta = () => {
  const { i18n } = useTranslation();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "pt", name: "Português", flag: "https://flagcdn.com/w40/br.png" },
    { code: "en", name: "English", flag: "https://flagcdn.com/w40/us.png" },
    { code: "es", name: "Español", flag: "https://flagcdn.com/w40/es.png" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex w-full items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo que volta para a home */}
        <a href="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <div className="hidden flex-col sm:flex text-left font-bold text-slate-900 text-xs">
            <span>CAMPINA GRANDE</span>
            <span className="text-slate-500 font-medium">CONVENTION & VISITORS BUREAU</span>
          </div>
        </a>

        {/* Seletor de Idioma */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-500 transition-colors px-3 py-2 rounded-md"
          >
            <Globe className="h-5 w-5" />
            <span className="hidden sm:inline">Idioma</span>
          </button>

          {isLanguageOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 flex flex-col gap-1 bg-white border border-slate-100 rounded-lg p-2 shadow-xl z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);
                    setIsLanguageOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors w-full text-left"
                >
                  <img src={lang.flag} alt={lang.name} className="h-4 w-6 object-cover rounded-sm shadow-sm" />
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderProposta;