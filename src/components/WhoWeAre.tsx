import { useTranslation } from "react-i18next";

const WhoWeAre = () => {
  const { t } = useTranslation("whoweare");

  const cards = [
    { key: "mission" },
    { key: "vision" },
    { key: "values" },
  ];

  return (
    <section className="bg-neutral-800 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-4 text-3xl font-bold text-indigo-400">
          {t("title")}
        </h2>

        <p className="mb-12 max-w-3xl text-lg text-neutral-300">
          {t("description")}
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="rounded-xl border border-indigo-500/40 bg-neutral-900/60 p-6"
            >
              <h3 className="mb-3 text-xl font-semibold text-indigo-300">
                {t(`${card.key}.title`)}
              </h3>

              <p className="text-sm text-neutral-400">
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
