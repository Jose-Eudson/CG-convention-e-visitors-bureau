import { useTranslation } from "react-i18next";

// Importando as imagens dos logos
import brasilCvbLogo from "../assets/logos_partnerships/brasil-cvb-logo.png";
import accgLogo from "../assets/logos_partnerships/accg-logo.png";
import sindcampinaLogo from "../assets/logos_partnerships/sindcampina-logo.png";

const GovernmentPartnerships = () => {
  const { t } = useTranslation("partnerships");

  const partners = [
    {
      name: "Brasil CVB",
      logo: brasilCvbLogo,
      url: "https://brasilcvb.com.br/",
      alt: "Brasil Convention & Visitors Bureau"
    },
    {
      name: "ACCG",
      logo: accgLogo,
      url: "https://accg.com.br/",
      alt: "Associação Comercial de Campina Grande"
    },
    {
      name: "SindCampina",
      logo: sindcampinaLogo,
      url: "https://www.sindcampina.com.br/2019/site.php",
      alt: "SindCampina"
    }
  ];

  return (
    <section id="parcerias" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Título - padrão igual à Diretoria */}
        <div className="mb-4">
          <h2 className="mb-4 text-2xl md:text-3xl font-bold text-emerald-500">
            {t("title")}
          </h2>

          <p className="mb-12 text-slate-500">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid de Logos */}
        <div className="flex flex-col md:flex-row items-center justify-start gap-16 md:gap-20">
          {partners.map((partner, index) => (
            <a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-transform duration-300 hover:scale-110"
            >
              <img
                src={partner.logo}
                alt={partner.alt}
                className="h-40 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GovernmentPartnerships;
