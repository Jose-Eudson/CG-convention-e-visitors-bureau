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
    className="absolute -right-16 top-1/2 -translate-y-1/2 z-20 rounded-full border border-slate-300 bg-white p-2 text-slate-700 shadow-md transition hover:bg-slate-50"
    aria-label="Próximo"
  >
    <ChevronRight size={24} />
  </button>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -left-16 top-1/2 -translate-y-1/2 z-20 rounded-full border border-slate-300 bg-white p-2 text-slate-700 shadow-md transition hover:bg-slate-50"
    aria-label="Anterior"
  >
    <ChevronLeft size={24} />
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
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section
      id="diretoria"
      className="relative overflow-hidden py-24 bg-slate-100"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-4 animate-fade-up text-2xl md:text-3xl font-bold text-slate-700">
          {t("title")}
        </h2>

        <p className="mb-16 max-w-2xl animate-fade-up delay-100 text-slate-500">
          {t("subtitle")}
        </p>

        <Slider {...settings}>
          {boardMembers.map((member, index) => (
            <div key={index} className="h-full px-4 pb-16">

              <div className="flex h-full">

                <div className="group flex h-[320px] w-full flex-col justify-between rounded-t-[28px] rounded-b-2xl bg-white border border-slate-300 p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-md">

                  <div className="flex flex-col items-center">
                    <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-slate-200 shadow-sm">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="min-h-[56px] text-lg font-semibold tracking-wide text-slate-900">
                      {member.name}
                    </h3>
                  </div>


                  <div className="pt-3">
                    <span className="inline-block rounded-full bg-slate-50 px-4 py-1 text-sm font-medium text-emerald-600">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
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
