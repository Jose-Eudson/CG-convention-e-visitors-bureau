import { useTranslation } from "react-i18next";
import logo from "../assets/logo_cvbcg.svg";
import { Home, Users, Calendar, Handshake, Mail, MapPin, Briefcase, UserCheck } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation(["footer", "header"]);

  const links = [
    { id: "inicio", label: t("header:menu.inicio"), icon: Home },
    { id: "quem-somos", label: t("header:menu.quemSomos"), icon: Users },
    { id: "o-que-fazemos", label: t("header:menu.oQueFazemos"), icon: Briefcase },
    { id: "diretoria", label: t("header:menu.diretoria"), icon: UserCheck },
    { id: "eventos", label: t("header:menu.eventos"), icon: Calendar },
    { id: "associados", label: t("header:menu.associados"), icon: Handshake },
    { id: "contato", label: t("header:menu.contato"), icon: Mail },
  ];

  return (
    <footer className="bg-slate-100 text-slate-600 border-t border-slate-200" translate="no">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Logo CVB" className="h-12 w-auto" />
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight text-slate-900">CAMPINA GRANDE</span>
                <span className="text-xs font-medium leading-tight text-slate-600">CONVENTION & VISITORS BUREAU</span>
              </div>
            </div>

            <p className="text-sm text-slate-500 max-w-sm">
              {t("footer:description", { defaultValue: "Promovendo o turismo, eventos e desenvolvimento da região." })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full lg:w-auto">

            <div className="group">
              <h3 className="text-slate-900 font-medium mb-3 flex items-center gap-2">
                <Home className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                {t("footer:menu.title", { defaultValue: "Menu" })}
              </h3>
              <ul className="space-y-2">
                {links.slice(0, 4).map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`} className="flex items-center gap-2 hover:text-emerald-500 transition group-hover:translate-x-1">
                      <link.icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group">
              <h3 className="text-slate-900 font-medium mb-3 flex items-center gap-2">
                <Handshake className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                {t("footer:sections.title", { defaultValue: "Seções" })}
              </h3>
              <ul className="space-y-2">
                {links.slice(4).map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`} className="flex items-center gap-2 hover:text-emerald-500 transition group-hover:translate-x-1">
                      <link.icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group">
              <h3 className="text-slate-900 font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                {t("footer:contact.title", { defaultValue: "Contato" })}
              </h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Campina Grande - PB
                </li>
                <li>Brasil</li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  contato@cvbcg.com
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-12 pt-6 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Convention Bureau Campina Grande — {t("footer:rights")}
        </div>

      </div>
    </footer>
  );
};

export default Footer;