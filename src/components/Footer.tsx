import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("footer");

  const menuItems = [
    { id: "inicio", label: t("menu.home") },
    { id: "quem-somos", label: t("menu.about") },
    { id: "eventos", label: t("menu.events") },
    { id: "associados", label: t("menu.partners") },
    { id: "contato", label: t("menu.contact") },
  ];

  return (
    <footer className="border-t border-neutral-800 bg-black py-12" translate="no">
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="mb-8 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-xl font-bold text-white">
            CVB Campina Grande
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-neutral-400 transition-colors hover:text-emerald-400"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="border-t border-neutral-800 pt-8 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Convention Bureau Campina Grande. {t("rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
