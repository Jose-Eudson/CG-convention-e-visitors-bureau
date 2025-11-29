import { useTranslation } from "react-i18next";

const WhatWeDo = () => {
  const { t } = useTranslation("whatwedo");

  const services = [
    {
      key: "captacao",
      color: "text-emerald-400",
    },
    {
      key: "monitoramento",
      color: "text-blue-400",
    },
    {
      key: "intermediacao",
      color: "text-orange-400",
    },
    {
      key: "promocao",
      color: "text-pink-400",
    },
    {
      key: "apoio",
      color: "text-yellow-400",
    },
    {
      key: "consultoria",
      color: "text-indigo-400",
    },
    {
      key: "qualificacao",
      color: "text-emerald-400",
    },
    {
      key: "observatorio",
      color: "text-orange-400",
    },
    {
      key: "articulacao",
      color: "text-pink-400",
    },
  ];

  return (
    <section className="bg-neutral-900 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-3xl font-bold text-white">
          {t("title")}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-xl border border-neutral-700 bg-neutral-800 p-6 transition-colors hover:border-neutral-600"
            >
              <div className={`mb-3 text-3xl ${service.color}`}>●</div>

              <h3 className="mb-2 text-lg font-semibold text-white">
                {t(`${service.key}.title`)}
              </h3>

              <p className="text-sm text-neutral-400">
                {t(`${service.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
