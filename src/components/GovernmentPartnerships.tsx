import { useTranslation } from "react-i18next";
import { ExternalLink, Building2, Landmark, Briefcase } from "lucide-react";

interface Partner {
  name: string;
  category: string;
  description: string;
  url?: string;
}

const GovernmentPartnerships = () => {
  const { t } = useTranslation("partnerships");

  // URLs oficiais dos parceiros
  const partnerUrls = {
    governoEstado: "https://paraiba.pb.gov.br",
    prefeituraCG: "https://campinagrande.pb.gov.br",
    secretariaTurismo: "https://paraiba.pb.gov.br/diretas/secretaria-de-turismo"
  };

  const partners: Partner[] = [
    {
      name: t("partnerships.governoEstado.name"),
      category: t("partnerships.governoEstado.category"),
      description: t("partnerships.governoEstado.description"),
      url: partnerUrls.governoEstado
    },
    {
      name: t("partnerships.prefeituraCG.name"),
      category: t("partnerships.prefeituraCG.category"),
      description: t("partnerships.prefeituraCG.description"),
      url: partnerUrls.prefeituraCG
    },
    {
      name: t("partnerships.secretariaTurismo.name"),
      category: t("partnerships.secretariaTurismo.category"),
      description: t("partnerships.secretariaTurismo.description"),
      url: partnerUrls.secretariaTurismo
    }
  ];

  const collabItems = [
    {
      key: "support",
      icon: Building2,
      color: "text-blue-500"
    },
    {
      key: "infrastructure",
      icon: Landmark,
      color: "text-orange-500"
    },
    {
      key: "promotion",
      icon: Briefcase,
      color: "text-green-500"
    }
  ];

  return (
    <section id="parcerias" className="py-16 px-6 bg-slate-50">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <h2 className="text-4xl font-bold text-center mb-4">
          {t("partnerships.title")}
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-3xl mx-auto">
          {t("partnerships.description")}
        </p>

        {/* Grid de Parceiros com Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4 border-orange-500"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  {partner.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-slate-800">
                {partner.name}
              </h3>
              
              <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                {partner.description}
              </p>

              {/* Link Direto */}
              {partner.url && (
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
                >
                  <span>{t("partnerships.visitLink")}</span>
                  <ExternalLink 
                    size={16} 
                    className="group-hover:translate-x-1 transition-transform" 
                  />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Seção de Colaboração */}
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-slate-800">
            Como Colaboramos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collabItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.key}
                  className="bg-white p-6 rounded-lg shadow-sm text-center"
                >
                  <IconComponent 
                    className={`w-12 h-12 mx-auto mb-4 ${item.color}`}
                  />
                  <h4 className="font-bold text-lg mb-2">
                    {t(`partnerships.collab.${item.key}.title`)}
                  </h4>
                  <p className="text-slate-600 text-sm">
                    {t(`partnerships.collab.${item.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GovernmentPartnerships;
