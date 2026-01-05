import { useTranslation } from "react-i18next";

const WhoWeAre = () => {
  const { t } = useTranslation("whoweare");

  const cards = [
    { key: "mission" },
    { key: "vision" },
    { key: "values" },
  ];

  return (
    <section id="quem-somos" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-4 text-2xl md:text-3xl font-bold text-indigo-500">
          {t("title")}
        </h2>

        <p className="mb-12 max-w-3xl text-lg text-slate-600">
          {t("description")}
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-xl border border-indigo-200 bg-slate-50 p-6"
            >
              <h3 className="mb-3 text-xl font-semibold text-indigo-500">
                {t(`${card.key}.title`)}
              </h3>

              <p className="text-sm text-slate-500">
                {t(`${card.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
