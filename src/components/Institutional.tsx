import { useTranslation } from "react-i18next";
import { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Star, Eye, Handshake, Megaphone, HelpCircle,
  BookOpen, Award, BarChart, Users, ChevronLeft, ChevronRight
} from "lucide-react";

type Service = {
  key: string;
  icon: React.ElementType;
  color: string;
};

const NextArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-[-28px] md:-right-12 top-[48%] md:top-1/2 md:-translate-y-1/2 z-20 p-2 rounded-full bg-white text-slate-700 shadow-md border border-slate-100 hover:bg-slate-50 transition-colors"
      aria-label="Próximo"
    >
      <ChevronRight size={24} />
    </button>
  );
};

const PrevArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="absolute left-[-28px] md:-left-12 top-[48%] md:top-1/2 md:-translate-y-1/2 z-20 p-2 rounded-full bg-white text-slate-700 shadow-md border border-slate-100 hover:bg-slate-50 transition-colors"
      aria-label="Anterior"
    >
      <ChevronLeft size={24} />
    </button>
  );
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
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    draggable: true,
    touchThreshold: 20,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          dots: true,
          swipe: true,
          draggable: true,
          touchMove: true,
        }
      }
    ]
  };

  const sliderRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const runResize = () => {
      try {
        if (sliderRef.current?.innerSlider?.onWindowResized) {
          sliderRef.current.innerSlider.onWindowResized();
        }
      } catch (e) {
      }
    };

    const debounced = (() => {
      let t: any = 0;
      return () => {
        clearTimeout(t);
        t = setTimeout(runResize, 150);
      };
    })();
    const waitImagesAndRun = () => {
      const imgs = Array.from(document.querySelectorAll('#institucional img')) as HTMLImageElement[];
      if (imgs.length === 0) {
        runResize();
        return;
      }

      let remaining = imgs.filter(i => !i.complete).length;
      if (remaining === 0) {
        runResize();
        return;
      }

      const onLoadOrError = () => {
        remaining -= 1;
        if (remaining <= 0) runResize();
      };

      imgs.forEach(img => {
        if (img.complete) return;
        img.addEventListener('load', onLoadOrError, { once: true });
        img.addEventListener('error', onLoadOrError, { once: true });
      });
    };

    const initId = setTimeout(waitImagesAndRun, 120);

    let ro: ResizeObserver | null = null;
    try {
      const container = document.getElementById('institucional');
      if (container && (window as any).ResizeObserver) {
        ro = new (window as any).ResizeObserver(debounced);
        ro?.observe(container);
      }
    } catch (e) {
      ro = null;
    }

    window.addEventListener("load", debounced);
    window.addEventListener("resize", debounced);
    window.addEventListener("orientationchange", debounced);

    return () => {
      clearTimeout(initId);
      window.removeEventListener("load", debounced);
      window.removeEventListener("resize", debounced);
      window.removeEventListener("orientationchange", debounced);
      if (ro) {
        try { ro.disconnect(); } catch (e) {}
      }
    };
  }, []);

  const chunkedServices = Array.from(
    { length: Math.ceil(services.length / 4) },
    (_, i) => services.slice(i * 4, i * 4 + 4)
  );

  return (
    <section id="institucional" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 p-4 md:p-10">
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
        <div className="md:col-span-2 bg-white text-slate-700 p-4 md:p-10 rounded-xl flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {t("whatwedo.title")}
          </h2>
          {mounted ? (
            <Slider ref={sliderRef} {...sliderSettings}>
              {chunkedServices.map((group, i) => (
              <div key={i} className="px-2 pb-8">
                <div className="grid grid-cols-2 gap-6">
                  {group.map((service) => (
                    <div
                      key={service.key}
                      className="flex flex-col items-center justify-center h-[220px] rounded-xl bg-white text-slate-700 border border-slate-300 p-6 text-center shadow-sm hover:shadow-md transition-opacity duration-300"
                    >
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white mb-4">
                        <service.icon className="h-8 w-8" />
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
          ) : (
            <div className="h-[360px]" />
          )}
        </div>
      </div>
    </section>
  );
};

export default Institutional;
