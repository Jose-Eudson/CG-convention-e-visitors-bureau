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
  const [isHero, setIsHero] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  /* Detecta HERO e SEÇÕES */
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-header]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHero(
              (entry.target as HTMLElement).getAttribute("data-header") === "hero"
            );
          }
        });
      },
      { threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Esconde ao descer */
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY < lastScrollY.current || currentY < 80);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Clique fora idioma */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "inicio", label: t("menu.inicio") },
    { id: "quem-somos", label: t("menu.quemSomos") },
    { id: "o-que-fazemos", label: t("menu.oQueFazemos") },
    { id: "diretoria", label: t("menu.diretoria") },
    { id: "eventos", label: t("menu.eventos") },
    { id: "associados", label: t("menu.associados") },
  ];

  const textColor = isHero ? "text-white" : "text-black";
  const hoverColor = isHero ? "hover:text-emerald-300" : "hover:text-emerald-600";

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-[transform,opacity,background-color,backdrop-filter]
        duration-700 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        ${isHero ? "bg-transparent backdrop-blur-0 shadow-none" : "bg-white/60 backdrop-blur-xl shadow-sm"}
      `}
    >
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-12 py-4">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src={logo} alt={t("logoAlt")} className="h-10 md:h-12" />
          <div className={`hidden sm:flex flex-col ${textColor}`}>
            <span className="text-sm font-bold tracking-wider">
              CAMPINA GRANDE
            </span>
            <span className="text-xs tracking-wide">
              CONVENTION & VISITORS BUREAU
            </span>
          </div>
        </div>

        {/* MENU DESKTOP */}
        <nav className="hidden lg:flex gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-medium font-header tracking-wide ${textColor} ${hoverColor} transition-colors`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* AÇÕES */}
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={handleLogout}
              className={`hidden sm:flex items-center gap-2 text-sm font-medium font-header tracking-wide ${textColor} hover:text-red-500`}
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          )}

          {/* IDIOMA */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className={`flex items-center gap-2 text-sm font-medium font-header tracking-wide ${textColor} ${hoverColor}`}
            >
              <Globe className="h-5 w-5" />
              Idioma
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg bg-white shadow-xl p-2">
                {[
                  { code: "pt", label: "Português", flag: "/bandeiras/brasil.svg" },
                  { code: "en", label: "English", flag: "/bandeiras/eua.svg" },
                  { code: "es", label: "Español", flag: "/bandeiras/espanha.svg" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setIsLanguageOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium font-header text-black hover:bg-slate-100 rounded-md w-full"
                  >
                    <img src={lang.flag} className="h-5 w-5 rounded-full" />
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* MOBILE */}
          <button
            className={`lg:hidden ${textColor}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
