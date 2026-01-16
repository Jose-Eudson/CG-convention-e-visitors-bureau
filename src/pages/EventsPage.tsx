import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ExternalLink, Search, Filter } from 'lucide-react';
import { getAllEvents } from '../services/eventsService';
import type { Event } from '../types/Event';
import EventModal from '../components/EventModal';

const EventsPage = () => {
  const { t } = useTranslation('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      console.log('📡 Buscando todos os eventos...');
      const data = await getAllEvents();
      console.log('✅ Eventos carregados:', data);
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(search) ||
          event.description.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      if (selectedCategory && event.category !== selectedCategory) {
        return false;
      }

      if (selectedMonth) {
        const eventMonth = event.date.substring(0, 7); 
        if (eventMonth !== selectedMonth) return false;
      }

      return true;
    });
  }, [events, searchTerm, selectedCategory, selectedMonth]);

  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: Event[] } = {};
    
    filteredEvents.forEach(event => {
      const monthKey = event.date.substring(0, 7); 
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(event);
    });

    return groups;
  }, [filteredEvents]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    events.forEach(event => {
      months.add(event.date.substring(0, 7));
    });
    return Array.from(months).sort();
  }, [events]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  const formatMonthYear = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { 
      month: 'long',
      year: 'numeric'
    });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 200);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-16 md:py-24">
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-cvb-yellow/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-cvb-yellow/10 rounded-full blur-3xl" />
            
            <h1 className="relative text-4xl md:text-5xl font-bold mb-4">
              {t('list.title')}
            </h1>
            <p className="relative text-lg text-slate-300 max-w-2xl">
              {t('list.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
          <div className="text-center py-20">
            <p className="text-slate-600">Carregando eventos...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('list.filters.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">{t('list.filters.allCategories')}</option>
                <option value="conference">{t('categories.conference')}</option>
                <option value="workshop">{t('categories.workshop')}</option>
                <option value="seminar">{t('categories.seminar')}</option>
                <option value="exhibition">{t('categories.exhibition')}</option>
                <option value="networking">{t('categories.networking')}</option>
                <option value="cultural">{t('categories.cultural')}</option>
                <option value="sports">{t('categories.sports')}</option>
                <option value="other">{t('categories.other')}</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">{t('list.filters.allMonths')}</option>
                {availableMonths.map(month => {
                  const [year, monthNum] = month.split('-');
                  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
                  const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                  return (
                    <option key={month} value={month}>
                      {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">{t('list.noResults')}</p>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([month, events]) => (
            <div key={month} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 capitalize">
                {formatMonthYear(month)}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div
                    key={event.id}
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
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                          {t(`categories.${event.category}`)}
                        </span>
                        {event.isFeatured && (
                          <span className="text-xs font-semibold text-cvb-yellow-700 bg-cvb-yellow-50 px-3 py-1 rounded-full">
                            Destaque
                          </span>
                        )}
                      </div>

                      <div className="mb-3 flex items-center gap-2 text-xs text-slate-600">
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
                          {t('featured.moreInfo')}
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        </div>
        </>
      )}

      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default EventsPage;
