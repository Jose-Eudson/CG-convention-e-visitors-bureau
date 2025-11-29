import { useTranslation } from "react-i18next";

const Associates = () => {
  const { t } = useTranslation("associates");

  const associates = t("associates", { returnObjects: true }) as string[];
  const benefits = t("benefits", { returnObjects: true }) as string[];

  return (
    <section className="bg-neutral-900 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-3xl font-bold text-orange-400">
          {t("title")}
        </h2>

        <div className="mb-16 grid gap-6 md:grid-cols-4">
          {associates.map((associate, index) => (
            <div
              key={index}
              className="flex h-32 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-500"
            >
              [Logo {associate}]
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/40 p-8 md:p-12">
          <h3 className="mb-4 text-2xl font-bold text-white">
            {t("callTitle")}
          </h3>

          <p className="mb-6 text-neutral-300">{t("callText")}</p>

          <ul className="mb-8 space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-neutral-300">
                <span className="text-orange-400">✓</span>
                {benefit}
              </li>
            ))}
          </ul>

          <button className="rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-orange-600">
            {t("button")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Associates;
