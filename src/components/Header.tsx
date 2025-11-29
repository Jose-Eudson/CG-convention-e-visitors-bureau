import logo from "../assets/logo_cvbcg.svg";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation("header");

  const navItems = [
    { id: "inicio", label: t("menu.inicio") },
    { id: "quem-somos", label: t("menu.quemSomos") },
    { id: "o-que-fazemos", label: t("menu.oQueFazemos") },
    { id: "diretoria", label: t("menu.diretoria") },
    { id: "eventos", label: t("menu.eventos") },
    { id: "associados", label: t("menu.associados") },
    { id: "contato", label: t("menu.contato") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* 🔥 BARRA DE LINGUAGEM DISCRETA COM BANDEIRAS */}
      <div className="bg-black/70 backdrop-blur text-white py-1 px-4 flex justify-end gap-2 border-b border-neutral-800">
        <img
          src="/bandeiras/brasil.svg"
          alt="Português"
          className="h-5 w-auto cursor-pointer"
          onClick={() => i18n.changeLanguage("pt")}
        />
        <img
          src="/bandeiras/eua.svg"
          alt="English"
          className="h-5 w-auto cursor-pointer"
          onClick={() => i18n.changeLanguage("en")}
        />
        <img
          src="/bandeiras/espanha.svg"
          alt="Español"
          className="h-5 w-auto cursor-pointer"
          onClick={() => i18n.changeLanguage("es")}
        />
      </div>

      {/* 🔥 HEADER PRINCIPAL */}
      <div className="bg-black/90 backdrop-blur border-b border-neutral-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt={t("logoAlt")} className="h-10 w-auto" />
            <span className="text-lg font-bold text-white">{t("title")}</span>
          </div>

          <nav className="hidden gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-neutral-300 transition-colors hover:text-emerald-400"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button className="md:hidden text-white">
            <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
