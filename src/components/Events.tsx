import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedEvents } from "../services/eventsService";
import type { Event } from "../types/Event";
import EventModal from "./EventModal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Events = () => {
  const { t } = useTranslation("events");
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Carregar eventos do Firebase
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      console.log('🔍 Buscando eventos em destaque...');
      const data = await getFeaturedEvents();
      console.log('✅ Eventos encontrados:', data);
      console.log('📊 Total de eventos em destaque:', data.length);
      setFeaturedEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const settings = {
    dots: true,
    infinite: featuredEvents.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: featuredEvents.length > 3,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: featuredEvents.length > 2,
          arrows: featuredEvents.length > 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: featuredEvents.length > 1,
          arrows: featuredEvents.length > 1
        }
      }
    ]
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 200);
  };

  if (loading) {
    return (
      <section id="eventos" className="bg-slate-50 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="text-center py-20">
            <p className="text-slate-600">Carregando eventos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredEvents.length === 0) {
    return (
      <section id="eventos" className="bg-slate-50 py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
            {t("featured.title")}
          </h2>
          <div className="text-center py-20">
            <p className="text-slate-600">Nenhum evento em destaque no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="eventos" className="bg-slate-50 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            {t("featured.title")}
          </h2>
          
          <div className="flex gap-3">
            <Link
              to="/eventos"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:scale-105"
            >
              {t("featured.viewAll")}
            </Link>
            <Link
              to="/solicitar-evento"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:scale-105"
            >
              {t("featured.register")}
            </Link>
          </div>
        </div>

        <Slider {...settings}>
          {featuredEvents.map((event) => (
            <div key={event.id} className="px-4 pb-12">
              <div 
                onClick={() => handleEventClick(event)}
                className="flex flex-col h-[450px] overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
              >
                {event.image && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}
                
                <div className="flex flex-col flex-1 p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-indigo-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.date)}
                    {event.endDate && ` - ${formatDate(event.endDate)}`}
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="mb-3 text-sm text-slate-600 line-clamp-3 flex-1">
                    {event.description}
                  </p>

                  <p className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </p>

                  {event.externalLink && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(event.externalLink, '_blank');
                      }}
                      className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {t("featured.moreInfo")}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  );
};

export default Events;