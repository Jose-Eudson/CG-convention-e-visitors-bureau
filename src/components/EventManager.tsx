import { useState, useEffect } from 'react';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../services/eventsService';
import type { Event } from '../types/Event';
import { Calendar, MapPin, Trash2, Edit2, Plus, X, ArrowLeft, Upload, Link as LinkIcon, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

const EventManager = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [useUrl, setUseUrl] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState<{ id: string; title: string } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<{ type: 'create' | 'update' | 'delete'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    image: '',
    externalLink: '',
    isFeatured: false,
    category: 'conference' as Event['category'],
    status: 'open' as Event['status']
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await getAllEvents();
    setEvents(data);
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `events/${fileName}`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setUploadingImage(false);
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      setUploadingImage(false);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
      return null;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;
      
      if (!useUrl && imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          return;
        }
      }

      const eventData = {
        ...formData,
        image: imageUrl
      };

      const eventId = await createEvent(eventData);
      
      if (eventId) {
        setShowSuccessModal({ type: 'create', message: 'Evento criado com sucesso!' });
        await loadEvents();
        resetForm();
      } else {
        alert('Erro ao criar evento. Verifique as regras de segurança do Firestore.');
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento: ' + (error as Error).message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    let imageUrl = formData.image;
    
    if (!useUrl && imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        return;
      }
    }

    const eventData = {
      ...formData,
      image: imageUrl
    };

    const success = await updateEvent(editingEvent.id, eventData);
    
    if (success) {
      setShowSuccessModal({ type: 'update', message: 'Evento atualizado com sucesso!' });
      await loadEvents();
      resetForm();
    } else {
      alert('Erro ao atualizar evento');
    }
  };

  const toggleFeatured = async (eventId: string, currentStatus: boolean) => {
    const success = await updateEvent(eventId, { isFeatured: !currentStatus });
    if (success) {
      await loadEvents();
    } else {
      alert('Erro ao atualizar evento');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!showDeleteModal) return;
    
    const success = await deleteEvent(showDeleteModal.id);
    
    if (success) {
      setShowDeleteModal(null);
      setShowSuccessModal({ type: 'delete', message: 'Evento deletado com sucesso!' });
      await loadEvents();
    } else {
      alert('Erro ao deletar evento');
      setShowDeleteModal(null);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      endDate: event.endDate || '',
      location: event.location,
      image: event.image || '',
      externalLink: event.externalLink || '',
      isFeatured: event.isFeatured,
      category: event.category,
      status: event.status
    });
    setImagePreview(event.image || '');
    setUseUrl(true);
    setImageFile(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      endDate: '',
      location: '',
      image: '',
      externalLink: '',
      isFeatured: false,
      category: 'conference',
      status: 'open'
    });
    setEditingEvent(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview('');
    setUseUrl(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long',
      year: 'numeric'
    });
  };

  const translateCategory = (category: Event['category']): string => {
    const translations = {
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

  const translateStatus = (status: Event['status']): string => {
    const translations = {
      open: 'Inscrições Abertas',
      upcoming: 'Em Breve',
      ongoing: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return translations[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-slate-600">Carregando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 pt-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors rounded px-3 py-2 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Área Administrativa
              </button>
            </div>

            <Link 
              to="/admin/solicitacoes" 
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              📋 Ver Solicitações Pendentes
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Gerenciar Eventos</h1>
              <p className="text-slate-600 mt-1">
                {events.length} {events.length === 1 ? 'evento cadastrado' : 'eventos cadastrados'}
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              {showForm ? (
                <>
                  <X className="h-5 w-5" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Novo Evento
                </>
              )}
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              {editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}
            </h2>
            
            <form onSubmit={editingEvent ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Local
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Data Início
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Data Fim (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Categoria
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Event['category'] })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="conference">Conferência</option>
                    <option value="workshop">Workshop</option>
                    <option value="seminar">Seminário</option>
                    <option value="exhibition">Feira/Exposição</option>
                    <option value="networking">Networking</option>
                    <option value="cultural">Cultural</option>
                    <option value="sports">Esportivo</option>
                    <option value="other">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Event['status'] })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="open">Inscrições Abertas</option>
                    <option value="upcoming">Em Breve</option>
                    <option value="ongoing">Em Andamento</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Imagem do Evento (opcional)
                </label>
                
                <div className="flex gap-4 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUseUrl(true);
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      useUrl ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    <LinkIcon className="h-4 w-4" />
                    URL da Imagem
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setUseUrl(false);
                      setFormData({ ...formData, image: '' });
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      !useUrl ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Fazer Upload
                  </button>
                </div>

                {useUrl ? (
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Máximo 5MB. Formatos: JPG, PNG, GIF, WebP
                    </p>
                  </>
                )}

                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-300">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {uploadingImage && (
                  <div className="flex items-center gap-2 text-indigo-600">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    Fazendo upload da imagem...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Link Externo (opcional)
                </label>
                <input
                  type="url"
                  value={formData.externalLink}
                  onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                  placeholder="https://inscricoes.exemplo.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Descrição
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-slate-700">
                  Evento em Destaque
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 transition-colors"
                >
                  {editingEvent ? 'Atualizar' : 'Criar Evento'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-slate-200 px-6 py-2 text-slate-700 hover:bg-slate-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center shadow-md">
                <p className="text-slate-600 text-lg">Nenhum evento cadastrado ainda.</p>
                <p className="text-slate-500 text-sm mt-2">Clique em "Novo Evento" para começar</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row">
                      {event.image && (
                        <div className="lg:w-80 flex-shrink-0 overflow-hidden">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col gap-2 mb-3">
                              <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                              <div className="flex flex-wrap items-center gap-2">
                                {event.isFeatured && (
                                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                                    ⭐ Destaque
                                  </span>
                                )}
                                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                                  {translateCategory(event.category)}
                                </span>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                  {translateStatus(event.status)}
                                </span>
                              </div>
                            </div>

                            <p className="mb-3 text-slate-600 line-clamp-3">{event.description}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(event.date)}
                                {event.endDate && ` - ${formatDate(event.endDate)}`}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {event.location}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleFeatured(event.id, event.isFeatured)}
                              className={`rounded-lg p-2 transition-colors ${
                                event.isFeatured 
                                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              }`}
                              title={event.isFeatured ? 'Remover do destaque' : 'Adicionar ao destaque'}
                            >
                              <Star className={`h-5 w-5 ${event.isFeatured ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => handleEdit(event)}
                              className="rounded-lg bg-indigo-100 p-2 text-indigo-600 hover:bg-indigo-200 transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setShowDeleteModal({ id: event.id, title: event.title })}
                              className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="h-5 w-5" />
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
        )}
      </div>

      {showDeleteModal && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowDeleteModal(null)}
          />
          <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                    <Trash2 className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Deletar evento?</h3>
                  <p className="text-slate-600 mb-2">
                    Tem certeza que deseja deletar o evento
                  </p>
                  <p className="text-slate-900 font-semibold mb-4">"{showDeleteModal.title}"?</p>
                  <p className="text-sm text-red-600 mb-8">Esta ação não pode ser desfeita.</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowDeleteModal(null)}
                      className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteConfirmed}
                      className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showSuccessModal && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowSuccessModal(null)}
          />
          <div className="fixed inset-0 z-[70] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-8 text-center">
                  <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                    showSuccessModal.type === 'create' ? 'bg-emerald-100' :
                    showSuccessModal.type === 'update' ? 'bg-indigo-100' :
                    'bg-slate-100'
                  }`}>
                    <CheckCircle className={`h-10 w-10 ${
                      showSuccessModal.type === 'create' ? 'text-emerald-600' :
                      showSuccessModal.type === 'update' ? 'text-indigo-600' :
                      'text-slate-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {showSuccessModal.type === 'create' && 'Criado!'}
                    {showSuccessModal.type === 'update' && 'Atualizado!'}
                    {showSuccessModal.type === 'delete' && 'Deletado!'}
                  </h3>
                  <p className="text-slate-600 mb-8">{showSuccessModal.message}</p>
                  <button
                    onClick={() => setShowSuccessModal(null)}
                    className={`px-8 py-3 rounded-xl text-white font-semibold transition-all ${
                      showSuccessModal.type === 'create' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      showSuccessModal.type === 'update' ? 'bg-indigo-600 hover:bg-indigo-700' :
                      'bg-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
    </div>
  );
};

export default EventManager;
