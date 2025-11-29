import { useTranslation } from "react-i18next";

const SecondaryEvents = () => {
  const { t } = useTranslation("secondaryEvents");

  const secondaryEvents = t("list", { returnObjects: true }) as string[];

  return (
    <section className="bg-neutral-800 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-3xl font-bold text-yellow-400">
          {t("title")}
        </h2>

        <div className="space-y-4">
          {secondaryEvents.map((event, index) => (
            <div
              key={index}
              className="rounded-lg border border-neutral-700 bg-neutral-900 p-4 text-neutral-300"
            >
              {event}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecondaryEvents;
