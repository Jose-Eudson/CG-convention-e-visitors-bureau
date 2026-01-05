import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import andreImg from "../assets/andremotta.jpg";
import pabloImg from "../assets/pablojatoba.jpg";
import fabiolaImg from "../assets/fabiolacortezzi.jpg";
import divaildoImg from "../assets/divaildojunior.jpg";
import manuelaImg from "../assets/manueladantas.jpg";
import luizImg from "../assets/luizcarloslira.jpg";
import izabelliImg from "../assets/izabelliaraujo.jpg";
import tupacImg from "../assets/tupacrodrigues.jpg";

const NextArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-2 md:right-[-60px] top-1/2 -translate-y-1/2 -mt-6 z-20 p-2 rounded-full bg-white text-slate-700 shadow-md border border-slate-100 hover:bg-slate-50 transition-colors"
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
      className="absolute left-2 md:left-[-60px] top-1/2 -translate-y-1/2 -mt-6 z-20 p-2 rounded-full bg-white text-slate-700 shadow-md border border-slate-100 hover:bg-slate-50 transition-colors"
      aria-label="Anterior"
    >
      <ChevronLeft size={24} />
    </button>
  );
};

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
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section id="diretoria" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-4 text-2xl md:text-3xl font-bold text-emerald-500">
          {t("title")}
        </h2>

        <p className="mb-12 text-slate-500">{t("subtitle")}</p>

        <Slider {...settings}>
          {boardMembers.map((member, index) => (
            <div key={index} className="px-4 h-full pb-12">
              <div className="flex flex-col items-center justify-between min-h-[270px] h-auto rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200">
                <div className="w-full flex flex-col items-center">
                  <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 overflow-hidden">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>[Foto]</span>
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-slate-900 line-clamp-2">
                    {member.name}
                  </h3>
                </div>

                <p className="text-sm text-emerald-500 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Board;