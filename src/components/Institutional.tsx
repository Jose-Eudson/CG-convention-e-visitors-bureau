import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Star, Eye, Handshake, Megaphone, HelpCircle,
  BookOpen, Award, BarChart, Users
} from "lucide-react";

type Service = {
  key: string;
  icon: React.ElementType;
  color: string;
};

const Institutional = () => {
  const { t } = useTranslation("institutional");

  const services: Service[] = [
    { key: "captacao", icon: Star, color: "text-white" },
    { key: "monitoramento", icon: Eye, color: "text-white" },
    { key: "intermediacao", icon: Handshake, color: "text-white" },
    { key: "promocao", icon: Megaphone, color: "text-white" },
    { key: "apoio", icon: HelpCircle, color: "text-white" },
    { key: "consultoria", icon: BookOpen, color: "text-white" },
    { key: "qualificacao", icon: Award, color: "text-white" },
    { key: "observatorio", icon: BarChart, color: "text-white" },
    { key: "articulacao", icon: Users, color: "text-white" },
  ];

  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const chunkedServices = Array.from(
    { length: Math.ceil(services.length / 4) },
    (_, i) => services.slice(i * 4, i * 4 + 4)
  );

  return (
    <section id="institucional" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-700">
            {t("whoweare.title")}
          </h2>
          <p className="text-base max-w-2xl whitespace-pre-line text-slate-700 mb-6">
            {t("whoweare.description.part1")}
          </p>
          <p className="text-lg font-medium text-slate-700 border-l-4 border-emerald-600 pl-4 mb-6">
            {t("whoweare.description.lead")}
          </p>
          <p className="text-base max-w-2xl whitespace-pre-line text-slate-700">
            {t("whoweare.description.part2")}
          </p>
        </div>
        <div className="md:col-span-2 bg-white text-slate-700 p-10 rounded-xl flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t("whatwedo.title")}
          </h2>
          <Slider {...sliderSettings}>
            {chunkedServices.map((group, i) => (
              <div key={i} className="px-2 pb-8">
                <div className="grid grid-cols-2 gap-6">
                  {group.map((service) => (
                    <div
                      key={service.key}
                      className="flex flex-col items-center justify-center h-[200px] rounded-xl bg-white text-slate-700 border border-slate-300 p-6 text-center shadow-sm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white mb-3">
                        <service.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-sm font-semibold">
                        {t(`whatwedo.${service.key}.title`)}
                      </h3>
                      <p className="text-xs opacity-90">
                        {t(`whatwedo.${service.key}.description`)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Institutional;
