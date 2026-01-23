import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Service = {
  key: string;
  icon: React.ElementType;
};

const Institutional = () => {
  const { t } = useTranslation("institutional");
  const sliderRef = useRef<Slider | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  const services: Service[] = [
    { key: "captacao", icon: Star },
    { key: "monitoramento", icon: Eye },
    { key: "intermediacao", icon: Handshake },
    { key: "promocao", icon: Megaphone },
    { key: "apoio", icon: HelpCircle },
    { key: "consultoria", icon: BookOpen },
    { key: "qualificacao", icon: Award },
    { key: "observatorio", icon: BarChart },
    { key: "articulacao", icon: Users },
  ];

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const chunkedServices = Array.from(
    { length: Math.ceil(services.length / 4) },
    (_, i) => services.slice(i * 4, i * 4 + 4)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="institucional"
      className="relative overflow-hidden bg-transparent"
    >
      {/* CONTEÚDO */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="relative">
          {/* CARD PRINCIPAL */}
          <div
            className={`
              grid grid-cols-1 lg:grid-cols-2 gap-10
              rounded-2xl bg-white
              shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)]
              px-6 sm:px-8 lg:px-10 py-10 sm:py-12
              transition-all duration-[1600ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
          >
            <div className="flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1f3d2b] mb-4 sm:mb-5">
                {t("whoweare.title")}
              </h2>

              <p className="text-[#2f4f3f] mb-4 sm:mb-5 leading-relaxed max-w-xl text-sm sm:text-base">
                {t("whoweare.description.part1")}
              </p>

              <p className="text-[#1f3d2b] font-medium border-l-4 border-[#3b7a57] pl-4 mb-4 sm:mb-5 max-w-xl text-sm sm:text-base">
                {t("whoweare.description.lead")}
              </p>

              <p className="text-[#3f5f52] leading-relaxed max-w-xl text-sm sm:text-base">
                {t("whoweare.description.part2")}
              </p>
            </div>

            <div className="hidden lg:block" />
          </div>

          {/* CARD CARROSSEL */}
          <div
            className={`
              relative z-20
              mt-8 lg:mt-0
              lg:absolute lg:right-0 lg:top-1/2
              lg:-translate-y-1/2
              lg:w-[42%]
              transition-all duration-[2200ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              delay-300
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
            `}
          >
            <div className="h-full rounded-2xl bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35)] px-5 sm:px-7 py-10 sm:py-12">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1f3d2b] mb-6 sm:mb-8 text-center">
                {t("whatwedo.title")}
              </h3>

              <Slider ref={sliderRef} {...sliderSettings}>
                {chunkedServices.map((group, i) => (
                  <div key={i} className="px-2">
                    <div className="grid grid-cols-2 gap-4 sm:gap-5">
                      {group.map((service) => (
                        <div
                          key={service.key}
                          className="flex flex-col items-center justify-center h-[150px] sm:h-[170px] rounded-xl border border-slate-300 p-4 sm:p-5 text-center shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-[#3b7a57] text-white mb-3">
                            <service.icon className="h-5 w-5" />
                          </div>

                          <h3 className="mb-1 text-xs sm:text-sm font-semibold text-[#1f3d2b]">
                            {t(`whatwedo.${service.key}.title`)}
                          </h3>

                          <p className="text-[11px] sm:text-xs text-[#4f6f61] leading-snug">
                            {t(`whatwedo.${service.key}.description`)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Slider>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-[#3b7a57] hover:text-white transition"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-[#3b7a57] hover:text-white transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* V INFERIOR – LIGA AS SEÇÕES */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-slate-100"
        style={{
          clipPath: "polygon(0 0, 50% 70%, 100% 0, 100% 100%, 0 100%)",
        }}
      />
    </section>
  );
};

export default Institutional;
