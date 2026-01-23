import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, Menu, X, LogOut } from "lucide-react";

const logo = "/assets/logo_cvbcg.svg";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { t, i18n } = useTranslation("header");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const isHomePage = location.pathname === "/";
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      
      setIsVisible(currentY < lastScrollY.current || currentY < 80);
      lastScrollY.current = currentY;

      if (isHomePage) {
        const hero = document.getElementById("inicio");
        if (hero) {
          const rect = hero.getBoundingClientRect();
          setIsHero(rect.bottom > 80);
        }
      } else {
        setIsHero(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "inicio", label: t("menu.inicio") },
    { id: "quem-somos", label: t("menu.quemSomos") },
    { id: "institucional", label: t("menu.oQueFazemos") },
    { id: "diretoria", label: t("menu.diretoria") },
    { id: "eventos", label: t("menu.eventos") },
    { id: "associados", label: t("menu.associados") },
  ];

  const textColor = (isHero && isHomePage) ? "text-white" : "text-black";
  const hoverColor = (isHero && isHomePage)
    ? "hover:text-emerald-300"
    : "hover:text-emerald-600";

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    const scrollToSection = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (isHomePage) {
      scrollToSection();
    } else {
      navigate("/");
      setTimeout(scrollToSection, 120);
    }

    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-[transform,opacity,background-color,backdrop-filter]
        duration-700 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        ${isHero && isHomePage ? "bg-transparent backdrop-blur-0 shadow-none" : "bg-white/70 backdrop-blur-md shadow-sm"}
      `}
    >
      <div className="h-16 md:h-20 flex items-center justify-between px-3 md:px-6 lg:px-12">
        <div className="flex items-center gap-2 md:gap-3 h-full">
          <img 
            src={logo} 
            alt={t("logoAlt")} 
            className="h-10 md:h-12 w-auto object-contain" 
          />
          <div className={`hidden sm:flex flex-col justify-center ${textColor}`}>
            <span className="text-xs md:text-sm font-bold tracking-wider leading-none mb-0.5">
              CAMPINA GRANDE
            </span>
            <span className="text-[10px] md:text-xs tracking-wide leading-none">
              CONVENTION & VISITORS BUREAU
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 h-full">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`text-sm font-medium font-header tracking-wide ${textColor} ${hoverColor} transition-colors flex items-center h-full`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3 h-full">
          <button
            onClick={() => navigate("/admin")}
            className={`hidden md:flex items-center gap-2 text-xs md:text-sm font-medium font-header tracking-wide ${textColor} ${hoverColor} transition-colors px-3 py-2 rounded-md`}
          >
            Área Administrativa
          </button>
          
          {user && isAdminRoute && (
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-medium text-slate-600 hover:text-red-500 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
              title="Sair da conta de administrador"
            >
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden lg:inline">Sair</span>
            </button>
          )}

          <div className="relative flex items-center h-full" ref={dropdownRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className={`flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-medium font-header tracking-wide ${textColor} ${hoverColor} px-2 py-2 rounded-md transition-colors`}
            >
              <Globe className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Idioma</span>
            </button>

            {isLanguageOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 md:w-40 rounded-lg bg-white shadow-xl p-2 border border-slate-200">
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
                    className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 text-xs md:text-sm font-medium font-header text-black hover:bg-slate-100 rounded-md w-full transition-colors"
                  >
                    <img src={lang.flag} className="h-4 w-4 md:h-5 md:w-5 rounded-full" alt={lang.label} />
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className={`lg:hidden ${textColor} p-2 flex items-center`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-lg">
          <nav className="flex flex-col p-4 max-h-[calc(100vh-80px)] overflow-y-auto">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className="py-3 text-base font-medium text-slate-600 hover:text-emerald-500 border-b border-slate-50 last:border-0 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => { 
                setIsMobileMenuOpen(false); 
                navigate("/admin"); 
              }}
              className="mt-4 py-3 text-base font-semibold text-white bg-emerald-600 rounded-md shadow hover:bg-emerald-700 transition-colors"
            >
              Área Administrativa
            </button>
            
            {user && isAdminRoute && (
              <button
                onClick={handleLogout}
                className="mt-2 py-3 flex items-center justify-center gap-2 text-base font-semibold text-white bg-red-500 rounded-md shadow hover:bg-red-600 transition-colors"
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
