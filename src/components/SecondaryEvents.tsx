import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";

const SecondaryEvents = () => {
  const { t } = useTranslation("secondaryEvents");

  const secondaryEvents = t("list", { returnObjects: true }) as string[];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-12 text-3xl font-bold text-yellow-500">
          {t("title")}
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryEvents.map((event, index) => (
            <div
              key={event} 
              className="group rounded-xl border border-slate-200 bg-slate-50 p-6 text-slate-600 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-yellow-500/50 hover:bg-white"
            >
              <div className="mb-3 flex items-center gap-3">
                <Calendar className={`h-6 w-6 ${index % 2 === 0 ? 'text-yellow-500' : 'text-yellow-400'}`} />
                <span className="text-sm font-semibold text-yellow-500 group-hover:text-yellow-400 transition-colors">
                  Evento {index + 1}
                </span>
              </div>

              <p className="text-base leading-relaxed group-hover:text-slate-700 transition-colors">
                {event}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecondaryEvents;