import { useTranslation } from "react-i18next";
import logo from "../assets/logo_cvbcg.svg";
import logoGov from "../assets/brasao.png";
import {Home, Users, Briefcase, UserCheck, Calendar, Handshake, Mail, MapPin, Phone, } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation(["footer", "header"]);

  const menuLinks = [
    { id: "inicio", label: t("header:menu.inicio"), icon: Home },
    { id: "quem-somos", label: t("header:menu.quemSomos"), icon: Users },
    {
      id: "o-que-fazemos",
      label: t("header:menu.oQueFazemos"),
      icon: Briefcase,
    },
    { id: "diretoria", label: t("header:menu.diretoria"), icon: UserCheck },
  ];

  const sectionLinks = [
    { id: "eventos", label: t("header:menu.eventos"), icon: Calendar },
    { id: "associados", label: t("header:menu.associados"), icon: Handshake },
  ];

  return (
    <footer
      className="bg-slate-100 text-slate-600 border-t border-slate-200"
      translate="no"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo CVB" className="h-10 w-auto" />
              <div className="leading-tight">
                <div className="text-sm font-semibold text-slate-900">
                  CAMPINA GRANDE
                </div>
                <div className="text-xs text-slate-500">
                  CONVENTION & VISITORS BUREAU
                </div>
              </div>
            </div>

            
            <div className="mt-3">
              <a
                href="https://paraiba.pb.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
                title="Acesse o site do Governo da Paraíba"
              >
                <img
                  src={logoGov}
                  alt="Governo da Paraíba"
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full object-contain bg-white border border-slate-200 p-0.5 opacity-90 hover:opacity-100 transition-opacity"
                />
              </a>
            </div>

            <p className="mt-4 text-sm text-slate-500 leading-snug max-w-sm">
              {t("footer:description", {
                defaultValue:
                  "Promovendo o turismo, eventos e desenvolvimento da região.",
              })}
            </p>
          </div>

          
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2 tracking-wide uppercase">
              Menu
            </h4>

            <ul className="space-y-0.5">
              {menuLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    <link.icon className="h-4 w-4 opacity-80" aria-hidden="true" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2 tracking-wide uppercase">
              Seções
            </h4>

            <ul className="space-y-0.5">
              {sectionLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                  >
                    <link.icon className="h-4 w-4 opacity-80" aria-hidden="true" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

         
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2 tracking-wide uppercase">
              Contato
            </h4>

            <ul className="space-y-0.5 text-sm">
              <li>
                <a
                  href="mailto:contato@cvbcg.com"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  <Mail className="h-4 w-4 opacity-80" aria-hidden="true" />
                  contato@cvbcg.com
                </a>
              </li>

              <li>
                <a
                  href="tel:+5583999219453"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  <Phone className="h-4 w-4 opacity-80" aria-hidden="true" />
                  (83) 99921-9453
                </a>
              </li>

              <li className="inline-flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 opacity-80" aria-hidden="true" />
                Campina Grande - PB
              </li>
            </ul>
          </div>
        </div>

       
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Convention Bureau Campina Grande —{" "}
          {t("footer:rights", { defaultValue: "Todos os direitos reservados" })}
        </div>
      </div>
    </footer>
  );
};

export default Footer;