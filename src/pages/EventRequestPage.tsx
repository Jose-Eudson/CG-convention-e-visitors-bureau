import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createEventRequest } from '../services/eventRequestService';
import { sendAdminNotification, sendConfirmationEmail } from '../services/emailServiceAPI';
import { Upload, Link as LinkIcon, ArrowLeft, Send } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import type { EventRequest } from '../types/EventRequest';

const EventRequestPage = () => {
  const navigate = useNavigate();
  
  // Scroll para o topo quando a página carregar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [useUrl, setUseUrl] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    image: '',
    externalLink: '',
    category: 'conference' as EventRequest['category'],
    submittedBy: {
      name: '',
      email: '',
      phone: '',
      organization: ''
    }
  });

  // Upload de imagem
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const storageRef = ref(storage, `event-requests/${fileName}`);
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.image;
      
      // Upload de imagem se necessário
      if (!useUrl && imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setSubmitting(false);
          return;
        }
      }

      // Preparar dados da solicitação (remover campos vazios)
      const requestData: any = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        image: imageUrl,
        category: formData.category,
        submittedBy: {
          name: formData.submittedBy.name,
          email: formData.submittedBy.email
        }
      };

      // Adicionar campos opcionais apenas se preenchidos
      if (formData.endDate) requestData.endDate = formData.endDate;
      if (formData.externalLink) requestData.externalLink = formData.externalLink;
      if (formData.submittedBy.phone) requestData.submittedBy.phone = formData.submittedBy.phone;
      if (formData.submittedBy.organization) requestData.submittedBy.organization = formData.submittedBy.organization;

      console.log('📝 Enviando solicitação:', requestData);
      const requestId = await createEventRequest(requestData);

      if (requestId) {
        // Enviar emails de notificação
        console.log('📧 Enviando notificações por email...');
        
        // Email para o solicitante
        const confirmationSent = await sendConfirmationEmail({
          submitterName: formData.submittedBy.name,
          submitterEmail: formData.submittedBy.email,
          title: formData.title,
          date: formData.date,
          location: formData.location
        });

        // Email para o admin
        const adminNotified = await sendAdminNotification({
          title: formData.title,
          description: formData.description,
          date: formData.date,
          location: formData.location,
          category: formData.category,
          submitterName: formData.submittedBy.name,
          submitterEmail: formData.submittedBy.email,
          submitterPhone: formData.submittedBy.phone,
          submitterOrganization: formData.submittedBy.organization
        });

        if (confirmationSent && adminNotified) {
          alert('✅ Solicitação enviada com sucesso! Você receberá uma resposta por email em breve.');
        } else if (confirmationSent || adminNotified) {
          alert('✅ Solicitação enviada! (Alguns emails podem não ter sido enviados)');
        } else {
          alert('✅ Solicitação salva! (Notificações por email não configuradas)');
        }
        
        navigate('/');
      } else {
        alert('❌ Erro ao enviar solicitação. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('❌ Erro ao enviar solicitação: ' + (error as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o site
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Solicitar Cadastro de Evento</h1>
          <p className="text-slate-600 mt-2">
            Preencha o formulário abaixo para solicitar a inclusão do seu evento no nosso calendário.
            Sua solicitação será analisada por nossa equipe.
          </p>
        </div>

        {/* Formulário */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Solicitante */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Suas Informações
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.submittedBy.name}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      submittedBy: { ...formData.submittedBy, name: e.target.value }
                    })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.submittedBy.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      submittedBy: { ...formData.submittedBy, email: e.target.value }
                    })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    value={formData.submittedBy.phone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      submittedBy: { ...formData.submittedBy, phone: e.target.value }
                    })}
                    placeholder="(83) 99999-9999"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Organização (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.submittedBy.organization}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      submittedBy: { ...formData.submittedBy, organization: e.target.value }
                    })}
                    placeholder="Nome da empresa/instituição"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>
            </div>

            {/* Informações do Evento */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Informações do Evento
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Título do Evento *
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
                    Local *
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
                    Data Início *
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
                    Categoria *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EventRequest['category'] })}
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
                    Link para Inscrições (opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.externalLink}
                    onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                    placeholder="https://inscricoes.exemplo.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Descreva o evento, sua programação, público-alvo, etc."
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Imagem */}
              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Imagem do Evento (opcional)
                </label>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setUseUrl(true);
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      useUrl 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
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
                      !useUrl 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
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
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Máximo 5MB. Formatos: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                )}

                {imagePreview && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">Preview:</p>
                    <div className="w-full h-48 rounded-lg overflow-hidden border border-slate-300">
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
            </div>

            {/* Aviso */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                ℹ️ Sua solicitação será analisada por nossa equipe. 
                Você receberá uma resposta por email em até 48 horas úteis.
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Enviar Solicitação
                  </>
                )}
              </button>
              <Link
                to="/"
                className="rounded-lg bg-slate-200 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRequestPage;
