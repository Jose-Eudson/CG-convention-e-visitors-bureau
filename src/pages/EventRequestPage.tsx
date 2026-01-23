import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createEventRequest } from '../services/eventRequestService';
import { sendAdminNotification, sendConfirmationEmail } from '../services/emailServiceAPI';
import { Upload, Link as LinkIcon, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import type { EventRequest } from '../types/EventRequest';

const EventRequestPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('form');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [useUrl, setUseUrl] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<{ title: string; message: string } | null>(null);

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
      setShowErrorModal({
        title: t('eventRequest.uploadError'),
        message: t('eventRequest.uploadErrorMessage')
      });
      return null;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setShowErrorModal({
          title: t('eventRequest.invalidFile'),
          message: t('eventRequest.invalidFileMessage')
        });
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setShowErrorModal({
          title: t('eventRequest.fileTooLarge'),
          message: t('eventRequest.fileTooLargeMessage')
        });
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
      
      if (!useUrl && imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setSubmitting(false);
          return;
        }
      }

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

      if (formData.endDate) requestData.endDate = formData.endDate;
      if (formData.externalLink) requestData.externalLink = formData.externalLink;
      if (formData.submittedBy.phone) requestData.submittedBy.phone = formData.submittedBy.phone;
      if (formData.submittedBy.organization) requestData.submittedBy.organization = formData.submittedBy.organization;

      console.log('Enviando solicitação:', requestData);
      const requestId = await createEventRequest(requestData);
      
      if (requestId) {
        console.log('Enviando notificações por email...');
        
        await sendConfirmationEmail({
          submitterName: formData.submittedBy.name,
          submitterEmail: formData.submittedBy.email,
          title: formData.title,
          date: formData.date,
          location: formData.location
        });

        await sendAdminNotification({
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

        setShowSuccessModal(true);
      } else {
        setShowErrorModal({
          title: t('eventRequest.submitError'),
          message: t('eventRequest.submitErrorMessage')
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      setShowErrorModal({
        title: t('eventRequest.unexpectedError'),
        message: t('eventRequest.unexpectedErrorMessage', { message: (error as Error).message })
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/eventos');
    setTimeout(() => {
      document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pt-28">
      <div className="mx-auto max-w-4xl px-4">
        <button
          type="button"
          onClick={() => {
            navigate('/');
            setTimeout(() => {
              document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' });
            }, 160);
          }}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors px-2 py-1 rounded-md"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('eventRequest.backToSite')}
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{t('eventRequest.title')}</h1>
          <p className="text-slate-600 mt-2">
            {t('eventRequest.subtitle')}
          </p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('eventRequest.yourInfo')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('eventRequest.yourName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.submittedBy.name}
                    onChange={(e) => setFormData({ ...formData, submittedBy: { ...formData.submittedBy, name: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('eventRequest.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.submittedBy.email}
                    onChange={(e) => setFormData({ ...formData, submittedBy: { ...formData.submittedBy, email: e.target.value } })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('eventRequest.phoneOptional')}
                  </label>
                  <input
                    type="tel"
                    value={formData.submittedBy.phone}
                    onChange={(e) => setFormData({ ...formData, submittedBy: { ...formData.submittedBy, phone: e.target.value } })}
                    placeholder={t('eventRequest.phonePlaceholder')}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('eventRequest.organizationOptional')}
                  </label>
                  <input
                    type="text"
                    value={formData.submittedBy.organization}
                    onChange={(e) => setFormData({ ...formData, submittedBy: { ...formData.submittedBy, organization: e.target.value } })}
                    placeholder={t('eventRequest.organizationPlaceholder')}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">{t('eventRequest.eventInfo')}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('eventRequest.eventTitle')}
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
                    {t('eventRequest.location')}
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
                    {t('eventRequest.startDate')}
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
                    {t('eventRequest.endDateOptional')}
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
                    {t('eventRequest.category')}
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as EventRequest['category'] })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="conference">{t('eventRequest.categories.conference')}</option>
                    <option value="workshop">{t('eventRequest.categories.workshop')}</option>
                    <option value="seminar">{t('eventRequest.categories.seminar')}</option>
                    <option value="exhibition">{t('eventRequest.categories.exhibition')}</option>
                    <option value="networking">{t('eventRequest.categories.networking')}</option>
                    <option value="cultural">{t('eventRequest.categories.cultural')}</option>
                    <option value="sports">{t('eventRequest.categories.sports')}</option>
                    <option value="other">{t('eventRequest.categories.other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t('eventRequest.registrationLinkOptional')}
                  </label>
                  <input
                    type="url"
                    value={formData.externalLink}
                    onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                    placeholder={t('eventRequest.registrationLinkPlaceholder')}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('eventRequest.description')}
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder={t('eventRequest.descriptionPlaceholder')}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              <div className="mt-4 space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  {t('eventRequest.eventImageOptional')}
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
                      useUrl ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    <LinkIcon className="h-4 w-4" />
                    {t('eventRequest.imageUrl')}
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
                    {t('eventRequest.uploadImage')}
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
                    placeholder={t('eventRequest.imageUrlPlaceholder')}
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
                      {t('eventRequest.uploadHelp')}
                    </p>
                  </div>
                )}

                {imagePreview && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-2">{t('eventRequest.preview')}</p>
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
                    {t('eventRequest.uploading')}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                {t('eventRequest.info')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('eventRequest.submitting')}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    {t('eventRequest.submit')}
                  </>
                )}
              </button>
              
              <Link
                to="/"
                className="rounded-lg bg-slate-200 px-6 py-3 text-slate-700 font-semibold hover:bg-slate-300 transition-colors"
              >
                {t('eventRequest.cancel')}
              </Link>
            </div>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
          />
          <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                    <CheckCircle className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('eventRequest.successTitle')}</h3>
                  <p className="text-slate-600 mb-2">
                    {t('eventRequest.successMessage')}
                  </p>
                  <p className="text-sm text-slate-500 mb-8">
                    {t('eventRequest.successNote')}
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all"
                  >
                    {t('eventRequest.ok')}
                  </button>
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

      {showErrorModal && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowErrorModal(null)}
          />
          <div className="fixed inset-0 z-[70] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-8 text-center">
                  <div className="mx-auto w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{showErrorModal.title}</h3>
                  <p className="text-slate-600 mb-8">{showErrorModal.message}</p>
                  <button
                    onClick={() => setShowErrorModal(null)}
                    className="px-8 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                  >
                    {t('eventRequest.ok')}
                  </button>
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

export default EventRequestPage;
