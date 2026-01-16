import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingRequests, approveEventRequest, rejectEventRequest } from '../services/eventRequestService';
import { sendApprovalEmail, sendRejectionEmail } from '../services/emailServiceAPI';
import type { EventRequest } from '../types/EventRequest';
import { Calendar, MapPin, User, Mail, Phone, Building, CheckCircle, XCircle, ArrowLeft, Eye, X } from 'lucide-react';

const EventRequestsManager = () => {
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<EventRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    console.log('🔄 Carregando solicitações...');
    setLoading(true);
    const data = await getPendingRequests();
    console.log('📦 Solicitações recebidas:', data);
    console.log('📊 Total de solicitações:', data.length);
    setRequests(data);
    setLoading(false);
  };

  const handleApprove = async (requestId: string) => {
    if (!confirm('Aprovar esta solicitação e criar o evento?')) return;
    

    const request = requests.find(r => r.id === requestId);
    if (!request) return;
    
    setProcessingId(requestId);
    const success = await approveEventRequest(requestId);
    
    if (success) {

      console.log('📧 Enviando email de aprovação...');
      await sendApprovalEmail({
        submitterName: request.submittedBy.name,
        submitterEmail: request.submittedBy.email,
        title: request.title,
        date: request.date
      });
      
      alert('✅ Solicitação aprovada! Evento criado com sucesso.');
      await loadRequests();
    } else {
      alert('❌ Erro ao aprovar solicitação');
    }
    setProcessingId(null);
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Motivo da rejeição (será enviado por email):');
    if (!reason) return;
    

    const request = requests.find(r => r.id === requestId);
    if (!request) return;
    
    setProcessingId(requestId);
    const success = await rejectEventRequest(requestId, reason);
    
    if (success) {

      console.log('📧 Enviando email de rejeição...');
      await sendRejectionEmail({
        submitterName: request.submittedBy.name,
        submitterEmail: request.submittedBy.email,
        title: request.title,
        rejectionReason: reason
      });
      
      alert('✅ Solicitação rejeitada.');
      await loadRequests();
    } else {
      alert('❌ Erro ao rejeitar solicitação');
    }
    setProcessingId(null);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-slate-600">Carregando solicitações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 pt-32">
      <div className="mx-auto max-w-6xl px-4">

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o site
            </Link>

            <Link 
              to="/admin/eventos" 
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              📋 Gerenciar eventos
            </Link>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">Solicitações de Eventos</h1>
            <p className="text-slate-600 mt-1">
              {requests.length} {requests.length === 1 ? 'solicitação pendente' : 'solicitações pendentes'}
            </p>
          </div>
        </div>


        {requests.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-md">
            <p className="text-slate-600 text-lg">Nenhuma solicitação pendente no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">

                  {request.image && (
                    <div className="lg:w-80 flex-shrink-0 overflow-hidden">
                      <img 
                        src={request.image} 
                        alt={request.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}


                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col gap-2 mb-3">
                          <h3 className="text-xl font-bold text-slate-900">{request.title}</h3>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                              {translateCategory(request.category)}
                            </span>
                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                              Pendente
                            </span>
                          </div>
                        </div>

                        <p className="mb-3 text-slate-600 line-clamp-2">{request.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(request.date)}
                            {request.endDate && ` - ${formatDate(request.endDate)}`}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {request.location}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsModalOpen(true);
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Ver detalhes completos
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                          className="rounded-lg bg-emerald-100 p-2 text-emerald-600 hover:bg-emerald-200 transition-colors disabled:opacity-50"
                          title="Aprovar"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                          className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
                          title="Rejeitar"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {isModalOpen && selectedRequest && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-slate-600 hover:bg-white hover:text-slate-900 transition-all shadow-lg"
                >
                  <X className="h-6 w-6" />
                </button>

                {selectedRequest.image && (
                  <div className="relative h-64 md:h-96 w-full overflow-hidden">
                    <img
                      src={selectedRequest.image}
                      alt={selectedRequest.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                      {translateCategory(selectedRequest.category)}
                    </span>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                      Pendente
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                    {selectedRequest.title}
                  </h2>

                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-indigo-100 p-2">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Data</p>
                        <p className="text-sm font-semibold">
                          {formatDate(selectedRequest.date)}
                          {selectedRequest.endDate && ` até ${formatDate(selectedRequest.endDate)}`}
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
                        <p className="text-sm font-semibold">{selectedRequest.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 my-6" />

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-3">Descrição do Evento</h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {selectedRequest.description}
                    </p>
                  </div>

                  {selectedRequest.externalLink && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">Link do Evento</h3>
                      <a
                        href={selectedRequest.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 underline break-all"
                      >
                        {selectedRequest.externalLink}
                      </a>
                    </div>
                  )}

                  <div className="border-t border-slate-200 my-6" />

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Informações do Solicitante</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Nome</p>
                          <p className="text-slate-700">{selectedRequest.submittedBy.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">Email</p>
                          <a href={`mailto:${selectedRequest.submittedBy.email}`} className="text-indigo-600 hover:text-indigo-700 break-all">
                            {selectedRequest.submittedBy.email}
                          </a>
                        </div>
                      </div>
                      {selectedRequest.submittedBy.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Telefone</p>
                            <a href={`tel:${selectedRequest.submittedBy.phone}`} className="text-slate-700 hover:text-indigo-600">
                              {selectedRequest.submittedBy.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {selectedRequest.submittedBy.organization && (
                        <div className="flex items-start gap-3">
                          <Building className="h-5 w-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1">Organização</p>
                            <p className="text-slate-700">{selectedRequest.submittedBy.organization}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        📅 Solicitado em: {formatDate(selectedRequest.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 flex gap-3">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleApprove(selectedRequest.id);
                      }}
                      disabled={processingId === selectedRequest.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Aprovar
                    </button>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        handleReject(selectedRequest.id);
                      }}
                      disabled={processingId === selectedRequest.id}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeitar
                    </button>
                  </div>
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
      )}
    </div>
  );
};

export default EventRequestsManager;
