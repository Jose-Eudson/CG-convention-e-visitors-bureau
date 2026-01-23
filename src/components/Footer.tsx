import { useTranslation } from "react-i18next";

const logo = "/assets/logo_cvbcg.svg";
const logoGov = "/assets/GovPBT.png";
import {
  Home,
  Users,
  Briefcase,
  UserCheck,
  Calendar,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Instagram,
} from "lucide-react";

const Footer = () => {
  const { t } = useTranslation(["footer", "header"]);

  const menuLinks = [
    { id: "inicio", label: t("header:menu.inicio"), icon: Home },
    { id: "quem-somos", label: t("header:menu.quemSomos"), icon: Users },
    { id: "o-que-fazemos", label: t("header:menu.oQueFazemos"), icon: Briefcase },
    { id: "diretoria", label: t("header:menu.diretoria"), icon: UserCheck },
  ];

  const sectionLinks = [
    { id: "eventos", label: t("header:menu.eventos"), icon: Calendar },
    { id: "associados", label: t("header:menu.associados"), icon: Handshake },
  ];

  return (
    <footer className="relative bg-slate-900 text-slate-300" translate="no">
      <div className="absolute top-0 left-0 w-full h-20 bg-slate-100">
        <div
          className="absolute bottom-0 left-0 w-full h-20 bg-slate-900"
          style={{
            clipPath: "polygon(0 0, 50% 70%, 100% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center pt-16">
        <img src={logo} alt="Logo CVB" className="h-12 w-auto" />

        <div className="mt-1 leading-tight">
          <div className="text-sm font-semibold text-white">
            CAMPINA GRANDE
          </div>
          <div className="text-xs text-slate-400">
            CONVENTION & VISITORS BUREAU
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-400 max-w-sm">
          {t("footer:footer.description")}
        </p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:ml-auto md:max-w-4xl">
          <div className="text-left">
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              {t("footer:footer.menu")}
            </h4>
            <ul className="space-y-1.5">
              {menuLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="inline-flex items-center gap-2 text-sm hover:text-emerald-400 transition-colors"
                  >
                    <link.icon className="h-4 w-4 opacity-80" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              {t("footer:footer.sections")}
            </h4>
            <ul className="space-y-1.5">
              {sectionLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="inline-flex items-center gap-2 text-sm hover:text-emerald-400 transition-colors"
                  >
                    <link.icon className="h-4 w-4 opacity-80" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
              {t("footer:footer.contact")}
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <a
                  href="mailto:contato@cvbcg.com"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="h-4 w-4 opacity-80" />
                  adm.comercial@cvbcg.com.br
                </a>
              </li>

              <li>
                <a
                  href="tel:+5583999219453"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="h-4 w-4 opacity-80" />
                  (83) 99921-9453
                </a>
              </li>

              <li>
                <a
                  href="https://instagram.com/campinagrandecvb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Instagram className="h-4 w-4 opacity-80" />
                  @campinagrandecvb
                </a>
              </li>

              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Av.+Floriano+Peixoto,+53+-+Sala+07,+Centro,+Campina+Grande+-+PB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <MapPin className="h-4 w-4 opacity-80" />
                  Av. Floriano Peixoto, 53 - Sala 07<br />
                  Centro - Campina Grande - PB
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-3 border-t border-slate-700 flex items-center justify-center gap-3 text-xs text-slate-400">
          <span>
            {t("footer:footer.copyright")}
          </span>

          <a
            href="https://paraiba.pb.gov.br"
            target="_blank"
            rel="noopener noreferrer"
            title="Governo da Paraíba"
            className="flex items-center"
          >
            <img
              src={logoGov}
              alt="Governo da Paraíba"
              className="h-7 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
