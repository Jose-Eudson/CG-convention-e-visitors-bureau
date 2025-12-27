import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Clock } from "lucide-react";

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
    <section className="bg-slate-50 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 md:mb-12 text-2xl md:text-3xl font-bold text-primary">
          {t("title")}
        </h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.name} 
              className="group rounded-xl border border-primary/20 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:scale-105"
            >
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Calendar className="h-6 w-6" />
                {event.date}
              </div>

              <h3 className="mb-2 text-lg font-semibold text-slate-900 group-hover:text-primary transition-colors">
                {event.name}
              </h3>

              <p className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-6 w-6" />
                {event.location}
              </p>

              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-700 px-3 py-1 text-xs text-neutral-300">
                <Clock className="h-5 w-5" />
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