import { X, Calendar, MapPin, ExternalLink, Tag } from 'lucide-react';
import type { Event } from '../types/Event';

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  if (!isOpen || !event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const translateCategory = (category: string): string => {
    const translations: Record<string, string> = {
      conference: 'Conferência',
      workshop: 'Workshop',
      seminar: 'Seminário',
      exhibition: 'Feira/Exposição',
      networking: 'Networking',
      cultural: 'Cultural',
      sports: 'Esportivo',
      other: 'Outros'
    };
    return translations[category] || category;
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-slate-600 hover:bg-white hover:text-slate-900 transition-all shadow-lg hover:shadow-xl"
            >
              <X className="h-6 w-6" />
            </button>

            {event.image && (
              <div className="relative h-64 md:h-96 w-full overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                  <Tag className="h-3 w-3" />
                  {translateCategory(event.category)}
                </span>
                {event.isFeatured && (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                    ⭐ Destaque
                  </span>
                )}
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {event.title}
              </h2>

              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Data</p>
                    <p className="text-sm font-semibold">
                      {formatDate(event.date)}
                      {event.endDate && (
                        <>
                          <br />
                          <span className="text-xs text-slate-500">até </span>
                          {formatDate(event.endDate)}
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-slate-200" />

                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-emerald-100 p-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Local</p>
                    <p className="text-sm font-semibold">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 my-6" />

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Sobre o Evento</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {event.externalLink && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <a
                    href={event.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 hover:shadow-lg"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Mais Informações
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default EventModal;
