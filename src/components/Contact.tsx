import { useTranslation } from "react-i18next";
import { MapPin, Instagram, Phone } from "lucide-react";

const Contact = () => {
  const { t } = useTranslation("contact");

  return (
    <section id="contato" className="bg-white py-12 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 md:mb-12 text-2xl md:text-3xl font-bold text-pink-500">
          {t("title")}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-100">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">{t("addressTitle")}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Rua Exemplo, 123 - Centro<br />
              Campina Grande - PB<br />
              CEP: 58400-000
            </p>
          </div>

          <a 
            href="https://www.instagram.com/campinagrandecvb"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-100"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-pink-600 group-hover:bg-pink-100 transition-colors">
              <Instagram className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">{t("socialTitle")}</h3>
            <p className="text-sm text-slate-600 font-medium group-hover:text-pink-600 transition-colors">
              @campinagrandecvb
            </p>
          </a>

          <a 
            href="https://wa.me/5583999219453"
            target="_blank"
            className="group flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-100"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">{t("whatsappTitle")}</h3>
            <p className="text-sm text-slate-600 font-medium group-hover:text-green-600 transition-colors">
              (83) 99921-9453
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
