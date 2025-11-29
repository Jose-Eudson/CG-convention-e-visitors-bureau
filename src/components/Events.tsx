import { useTranslation } from "react-i18next";

const Events = () => {
  const { t } = useTranslation("events");

  const events = [
    {
      date: "15 Dez",
      name: "Congresso Nacional de Tecnologia",
      location: t("eventsList.location.conventionCenter"),
      status: t("eventsList.status.confirmed")
    },
    {
      date: "22 Dez",
      name: "Feira de Negócios do Nordeste",
      location: t("eventsList.location.park"),
      status: t("eventsList.status.soon")
    },
    {
      date: "10 Jan",
      name: "Simpósio de Educação",
      location: t("eventsList.location.ufcg"),
      status: t("eventsList.status.open")
    }
  ];

  return (
    <section className="bg-neutral-900 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-3xl font-bold text-pink-400">
          {t("title")}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {events.map((event, index) => (
            <div
              key={index}
              className="rounded-xl border border-pink-500/40 bg-neutral-800 p-6"
            >
              <div className="mb-4 inline-block rounded-lg bg-pink-500/20 px-4 py-2 text-sm font-semibold text-pink-400">
                {event.date}
              </div>

              <h3 className="mb-2 text-lg font-semibold text-white">
                {event.name}
              </h3>

              <p className="mb-4 text-sm text-neutral-400">
                {event.location}
              </p>

              <span className="inline-block rounded-full bg-neutral-700 px-3 py-1 text-xs text-neutral-300">
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
