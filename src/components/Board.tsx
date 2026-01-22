import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const andreImg = "/assets/andremotta.jpg";
const pabloImg = "/assets/pablojatoba.jpg";
const fabiolaImg = "/assets/fabiolacortezzi.jpg";
const divaildoImg = "/assets/divaildojunior.jpg";
const manuelaImg = "/assets/manueladantas.jpg";
const luizImg = "/assets/luizcarloslira.jpg";
const izabelliImg = "/assets/izabelliaraujo.jpg";
const tupacImg = "/assets/tupacrodrigues.jpg";

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -right-4 lg:-right-14 top-1/2 -translate-y-1/2 z-20 rounded-full border border-slate-300 bg-white p-2 md:p-3 text-slate-700 shadow-md transition hover:bg-slate-50 hover:shadow-lg"
    aria-label="Próximo"
  >
    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -left-4 lg:-left-14 top-1/2 -translate-y-1/2 z-20 rounded-full border border-slate-300 bg-white p-2 md:p-3 text-slate-700 shadow-md transition hover:bg-slate-50 hover:shadow-lg"
    aria-label="Anterior"
  >
    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
  </button>
);

const Board = () => {
  const { t } = useTranslation("board");

  const boardMembers = [
    { name: "ANDRÉ DANTAS MOTTA", role: t("roles.president"), photo: andreImg },
    { name: "PABLO BARBOSA JATOBÁ", role: t("roles.vicePresident"), photo: pabloImg },
    { name: "MANUELA DANTAS MOTTA LOPES", role: t("roles.firstFinanceDirector"), photo: manuelaImg },
    { name: "FABÍOLA CORTEZZI GUIMARÃES DUARTE", role: t("roles.executiveDirector"), photo: fabiolaImg },
    { name: "DIVAILDO BARTOLOMEU DE LIMA JUNIOR", role: t("roles.firstSecretaryDirector"), photo: divaildoImg },
    { name: "TUPAC RODRIGUES ALBUQUERQUE DANTAS", role: t("roles.eventsDirector"), photo: tupacImg },
    { name: "LUIZ CARLOS LIRA", role: t("roles.heritageDirector"), photo: luizImg },
    { name: "IZABELLI ARAÚJO DINIZ", role: t("roles.publicRelations"), photo: izabelliImg },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true, 
    swipeToSlide: true,
    touchThreshold: 10,
    responsive: [
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: 2,
          arrows: true, 
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: 1,
          arrows: false, 
          centerMode: true,
          centerPadding: '20px',
        } 
      },
    ],
  };

  return (
    <section
      id="diretoria"
      className="relative overflow-hidden py-16 md:py-24 bg-slate-100"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-6 lg:px-12">
        <h2 className="mb-4 animate-fade-up text-xl md:text-2xl lg:text-3xl font-bold text-slate-700">
          {t("title")}
        </h2>

        <p className="mb-12 md:mb-16 max-w-2xl animate-fade-up delay-100 text-sm md:text-base text-slate-500">
          {t("subtitle")}
        </p>

        <div className="relative px-0 sm:px-4">
          <Slider {...settings}>
            {boardMembers.map((member, index) => (
              <div key={index} className="h-full px-2 sm:px-4 pb-12 md:pb-16">
                <div className="flex h-full">
                  <div className="group flex h-[280px] sm:h-[320px] w-full flex-col justify-between rounded-t-[28px] rounded-b-2xl bg-white border border-slate-300 p-4 sm:p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 sm:mb-4 h-24 w-24 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-slate-200 shadow-sm">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <h3 className="min-h-[48px] sm:min-h-[56px] text-base sm:text-lg font-semibold tracking-wide text-slate-900 px-2">
                        {member.name}
                      </h3>
                    </div>

                    <div className="pt-2 sm:pt-3">
                      <span className="inline-block rounded-full bg-slate-50 px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-emerald-600">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-fade-up {
            animation: fadeUp 0.7s ease-out forwards;
          }

          .delay-100 {
            animation-delay: 0.1s;
          }

          .slick-track {
            display: flex !important;
          }

          .slick-slide {
            display: flex !important;
            height: auto !important;
          }

          .slick-slide > div {
            display: flex;
            width: 100%;
          }
        `}
      </style>
    </section>
  );
};

export default Board;
