import { useState, useEffect } from 'react';
import { getAllAssociates, approveAssociate, rejectAssociate, deleteAssociate, type Associate } from '../services/associatesService';
import { sendApprovalEmail, sendRejectionEmail } from '../services/associateEmailService';
import { Check, X, Trash2, Clock, CheckCircle, XCircle, Download, ExternalLink, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssociatesManagerPage = () => {
  const navigate = useNavigate();
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showApproveModal, setShowApproveModal] = useState<{ id: string; name: string; associate: Associate } | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<{ id: string; name: string; associate: Associate } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<{ id: string; name: string; logo: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState<{ type: 'approve' | 'reject' | 'delete'; message: string } | null>(null);
  const [showErrorModal, setShowErrorModal] = useState<{ title: string; message: string } | null>(null);

  const fetchAssociates = async () => {
    try {
      setLoading(true);
      const data = await getAllAssociates();
      setAssociates(data);
    } catch (error) {
      console.error('Erro ao buscar associados:', error);
      setShowErrorModal({
        title: 'Erro ao Carregar',
        message: 'Erro ao carregar associados. Tente novamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociates();
  }, []);

  const handleApproveConfirmed = async () => {
    if (!showApproveModal) return;

    try {
      await approveAssociate(showApproveModal.id);
      
      try {
        await sendApprovalEmail(showApproveModal.associate);
      } catch (emailError) {
        console.warn('Email não enviado, mas associado foi aprovado:', emailError);
      }

      setShowApproveModal(null);
      setShowSuccessModal({
        type: 'approve',
        message: 'Associado aprovado com sucesso!'
      });
      fetchAssociates();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      setShowErrorModal({
        title: 'Erro ao Aprovar',
        message: 'Erro ao aprovar associado. Tente novamente.'
      });
      setShowApproveModal(null);
    }
  };

  const handleRejectConfirmed = async () => {
    if (!showRejectModal) return;

    if (!rejectionReason.trim()) {
      setShowErrorModal({
        title: 'Motivo Obrigatório',
        message: 'É necessário informar um motivo para rejeitar.'
      });
      return;
    }

    try {
      await rejectAssociate(showRejectModal.id);
      
      try {
        await sendRejectionEmail({
          ...showRejectModal.associate,
          rejectionReason
        });
      } catch (emailError) {
        console.warn('Email não enviado, mas associado foi rejeitado:', emailError);
      }

      setShowRejectModal(null);
      setRejectionReason('');
      setShowSuccessModal({
        type: 'reject',
        message: 'Associado rejeitado!'
      });
      fetchAssociates();
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      setShowErrorModal({
        title: 'Erro ao Rejeitar',
        message: 'Erro ao rejeitar associado. Tente novamente.'
      });
      setShowRejectModal(null);
      setRejectionReason('');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!showDeleteModal) return;

    try {
      await deleteAssociate(showDeleteModal.id, showDeleteModal.logo);
      setShowDeleteModal(null);
      setShowSuccessModal({
        type: 'delete',
        message: 'Associado deletado!'
      });
      fetchAssociates();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setShowErrorModal({
        title: 'Erro ao Deletar',
        message: 'Erro ao deletar associado. Tente novamente.'
      });
      setShowDeleteModal(null);
    }
  };

  const handleDownloadExcel = () => {
    if (filteredAssociates.length === 0) {
      setShowErrorModal({
        title: 'Nenhum Dado',
        message: 'Nenhum associado para exportar.'
      });
      return;
    }

    const data = filteredAssociates.map((a) => ({
      'Nome Fantasia': a.name,
      'Razão Social': a.razaoSocial || '',
      'Categoria': a.category,
      'CNPJ': a.cnpj || '',
      'Inscrição Estadual': a.inscricaoEstadual || '',
      'Inscrição Municipal': a.inscricaoMunicipal || '',
      'Endereço': a.endereco || '',
      'Bairro': a.bairro || '',
      'CEP': a.cep || '',
      'Responsável': a.nomeResponsavel || '',
      'Telefone': a.telefone || '',
      'Email': a.email || '',
      'Instagram': a.instagram || '',
      'Status': a.status === 'pending' ? 'Pendente' : a.status === 'approved' ? 'Aprovado' : 'Rejeitado',
      'Data Criação': a.createdAt?.toDate().toLocaleDateString('pt-BR')
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Associados');
    XLSX.writeFile(wb, `associados-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredAssociates = associates.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
            <Clock className="h-3 w-3" />
            Pendente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
            <CheckCircle className="h-3 w-3" />
            Aprovado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
            <XCircle className="h-3 w-3" />
            Rejeitado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors rounded px-3 py-2 font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para Área Administrativa
              </button>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Gerenciar Associados
            </h1>
            <p className="text-slate-600">
              Aprove ou rejeite solicitações de novos associados
            </p>
          </div>

          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Baixar Planilha
          </button>
        </div>

        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-orange-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Todos ({associates.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Pendentes ({associates.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'approved' ? 'bg-green-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Aprovados ({associates.filter((a) => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'rejected' ? 'bg-red-500 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Rejeitados ({associates.filter((a) => a.status === 'rejected').length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            <p className="mt-4 text-slate-600">Carregando...</p>
          </div>
        ) : filteredAssociates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-slate-500">Nenhum associado encontrado</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAssociates.map((associate) => (
              <div key={associate.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-32 h-32 flex-shrink-0 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center p-4">
                    {associate.logo ? (
                      <img
                        src={associate.logo}
                        alt={associate.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-slate-400 text-sm">Sem logo</span>
                    )}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">
                          {associate.name}
                        </h3>
                        <p className="text-sm font-semibold text-orange-600 uppercase">
                          {associate.category}
                        </p>
                      </div>
                      {getStatusBadge(associate.status)}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-700 text-sm uppercase border-b pb-1">
                        Dados Empresariais
                      </h4>
                      {associate.razaoSocial && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Razão Social:</span>{' '}
                          <span className="text-slate-800">{associate.razaoSocial}</span>
                        </p>
                      )}
                      {associate.cnpj && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">CNPJ:</span>{' '}
                          <span className="text-slate-800">{associate.cnpj}</span>
                        </p>
                      )}
                      {associate.inscricaoEstadual && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Inscrição Estadual:</span>{' '}
                          <span className="text-slate-800">{associate.inscricaoEstadual}</span>
                        </p>
                      )}
                      {associate.inscricaoMunicipal && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Inscrição Municipal:</span>{' '}
                          <span className="text-slate-800">{associate.inscricaoMunicipal}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-700 text-sm uppercase border-b pb-1">
                        Endereço
                      </h4>
                      {associate.endereco && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Rua:</span>{' '}
                          <span className="text-slate-800">{associate.endereco}</span>
                        </p>
                      )}
                      {associate.bairro && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Bairro:</span>{' '}
                          <span className="text-slate-800">{associate.bairro}</span>
                        </p>
                      )}
                      {associate.cep && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">CEP:</span>{' '}
                          <span className="text-slate-800">{associate.cep}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-700 text-sm uppercase border-b pb-1">
                        Responsável
                      </h4>
                      {associate.nomeResponsavel && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Nome:</span>{' '}
                          <span className="text-slate-800">{associate.nomeResponsavel}</span>
                        </p>
                      )}
                      {associate.telefoneResponsavel && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Telefone:</span>{' '}
                          <span className="text-slate-800">{associate.telefoneResponsavel}</span>
                        </p>
                      )}
                      {associate.emailResponsavel && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Email:</span>{' '}
                          <span className="text-slate-800">{associate.emailResponsavel}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-700 text-sm uppercase border-b pb-1">
                        Contato da Empresa
                      </h4>
                      {associate.telefone && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Telefone:</span>{' '}
                          <span className="text-slate-800">{associate.telefone}</span>
                        </p>
                      )}
                      {associate.email && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Email:</span>{' '}
                          <span className="text-slate-800">{associate.email}</span>
                        </p>
                      )}
                      {associate.instagram && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Instagram/Site:</span>{' '}
                          <a
                            href={associate.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:underline inline-flex items-center gap-1"
                          >
                            Ver perfil <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                      )}
                      {associate.numeroFuncionarios && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Funcionários:</span>{' '}
                          <span className="text-slate-800">{associate.numeroFuncionarios}</span>
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs text-slate-500">
                        Solicitação enviada em: {associate.createdAt?.toDate().toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {associate.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setShowApproveModal({ id: associate.id!, name: associate.name, associate })}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          Aprovar
                        </button>
                        <button
                          onClick={() => setShowRejectModal({ id: associate.id!, name: associate.name, associate })}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Rejeitar
                        </button>
                      </>
                    )}

                    {associate.status === 'approved' && (
                      <button
                        onClick={() => setShowRejectModal({ id: associate.id!, name: associate.name, associate })}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Remover
                      </button>
                    )}

                    {associate.status === 'rejected' && (
                      <button
                        onClick={() => setShowApproveModal({ id: associate.id!, name: associate.name, associate })}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Aprovar
                      </button>
                    )}

                    <button
                      onClick={() => setShowDeleteModal({ id: associate.id!, name: associate.name, logo: associate.logo })}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showApproveModal && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowApproveModal(null)}
          />
          <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Aprovar Associado</h3>
                  <p className="text-slate-600 mb-6">
                    Tem certeza que deseja aprovar <strong>{showApproveModal.name}</strong>?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowApproveModal(null)}
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleApproveConfirmed}
                      className="flex-1 px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showRejectModal && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setShowRejectModal(null);
              setRejectionReason('');
            }}
          />
          <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-8">
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Rejeitar Associado</h3>
                  <p className="text-slate-600 mb-4 text-center">
                    Informe o motivo da rejeição de <strong>{showRejectModal.name}</strong>:
                  </p>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Digite o motivo da rejeição..."
                    rows={4}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none mb-6"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRejectModal(null);
                        setRejectionReason('');
                      }}
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleRejectConfirmed}
                      className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
                  <div className="mx-auto w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Trash2 className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Deletar Associado</h3>
                  <p className="text-slate-600 mb-6">
                    Tem certeza que deseja deletar <strong>{showDeleteModal.name}</strong>?<br />
                    <span className="text-sm text-red-600">Esta ação não pode ser desfeita.</span>
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteModal(null)}
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteConfirmed}
                      className="flex-1 px-4 py-2 rounded-xl bg-slate-600 text-white font-semibold hover:bg-slate-700 transition-all"
                    >
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
                    showSuccessModal.type === 'approve' ? 'bg-emerald-100' :
                    showSuccessModal.type === 'reject' ? 'bg-orange-100' :
                    'bg-slate-100'
                  }`}>
                    {showSuccessModal.type === 'approve' && <CheckCircle className="h-10 w-10 text-emerald-600" />}
                    {showSuccessModal.type === 'reject' && <XCircle className="h-10 w-10 text-orange-600" />}
                    {showSuccessModal.type === 'delete' && <Trash2 className="h-10 w-10 text-slate-600" />}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    {showSuccessModal.type === 'approve' && 'Aprovado!'}
                    {showSuccessModal.type === 'reject' && 'Rejeitado!'}
                    {showSuccessModal.type === 'delete' && 'Deletado!'}
                  </h3>
                  <p className="text-slate-600 mb-8">{showSuccessModal.message}</p>
                  <button
                    onClick={() => setShowSuccessModal(null)}
                    className={`px-8 py-3 rounded-xl text-white font-semibold transition-all ${
                      showSuccessModal.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                      showSuccessModal.type === 'reject' ? 'bg-orange-600 hover:bg-orange-700' :
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
    </main>
  );
};

export default AssociatesManagerPage;
