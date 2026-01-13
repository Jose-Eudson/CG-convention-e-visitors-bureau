import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import {
  Star,
  Eye,
  Handshake,
  Megaphone,
  HelpCircle,
  BookOpen,
  Award,
  BarChart,
  Users,
} from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const InstitutionalSection = () => {
  const { t } = useTranslation("whoweare");
  const { t: tWhat } = useTranslation("whatwedo");

  const identityCards = ["mission", "vision", "values"];

  const services = [
    { key: "captacao", icon: Star, color: "text-emerald-500" },
    { key: "monitoramento", icon: Eye, color: "text-blue-500" },
    { key: "intermediacao", icon: Handshake, color: "text-orange-500" },
    { key: "promocao", icon: Megaphone, color: "text-pink-500" },
    { key: "apoio", icon: HelpCircle, color: "text-yellow-500" },
    { key: "consultoria", icon: BookOpen, color: "text-indigo-500" },
    { key: "qualificacao", icon: Award, color: "text-emerald-500" },
    { key: "observatorio", icon: BarChart, color: "text-orange-500" },
    { key: "articulacao", icon: Users, color: "text-pink-500" },
  ];

  const sliderBase = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
  };

  return (
    <section
       id="next-section"
      className="bg-gradient-to-b from-white via-slate-50 to-slate-50 py-14"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6 space-y-16">

        {/* ===== QUEM SOMOS ===== */}
        <div>
          <h2 className="mb-3 text-xl md:text-2xl font-bold text-indigo-600">
            {t("title")}
          </h2>

          <p className="mb-6 max-w-2xl text-sm text-slate-600">
            {t("description")}
          </p>

          <Slider
            {...sliderBase}
            slidesToShow={3}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 640, settings: { slidesToShow: 1 } },
            ]}
          >
            {identityCards.map((key) => (
              <div key={key} className="px-3 pb-6">
                <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <h3 className="mb-2 text-base font-semibold text-indigo-600">
                    {t(`${key}.title`)}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* ===== O QUE FAZEMOS ===== */}
        <div>
          <h2 className="mb-3 text-xl md:text-2xl font-bold text-slate-900">
            {tWhat("title")}
          </h2>

          <p className="mb-6 max-w-2xl text-sm text-slate-500">
            {tWhat("subtitle", { defaultValue: "" })}
          </p>

          <Slider
            {...sliderBase}
            slidesToShow={3}
            responsive={[
              { breakpoint: 1024, settings: { slidesToShow: 2 } },
              { breakpoint: 640, settings: { slidesToShow: 1 } },
            ]}
          >
            {services.map((service) => (
              <div key={service.key} className="px-3 pb-6">
                <div className="h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 ${service.color}`}
                  >
                    <service.icon className="h-5 w-5" />
                  </div>

                  <h3 className="mb-1 text-sm font-semibold text-slate-900">
                    {tWhat(`${service.key}.title`)}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {tWhat(`${service.key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default InstitutionalSection;
