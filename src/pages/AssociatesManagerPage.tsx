import { useState, useEffect } from 'react';
import {
  getAllAssociates,
  approveAssociate,
  rejectAssociate,
  deleteAssociate,
  type Associate
} from '../services/associatesService';
import { sendApprovalEmail, sendRejectionEmail } from '../services/associateEmailService';
import { Check, X, Trash2, Clock, CheckCircle, XCircle, Download, ExternalLink } from 'lucide-react';
import * as XLSX from 'xlsx';

const AssociatesManagerPage = () => {
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchAssociates = async () => {
    try {
      setLoading(true);
      const data = await getAllAssociates();
      setAssociates(data);
    } catch (error) {
      console.error('Erro ao buscar associados:', error);
      alert('Erro ao carregar associados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociates();
  }, []);

  const handleApprove = async (id: string, associate: Associate) => {
    if (!confirm('Deseja aprovar este associado?')) return;
    
    try {
      await approveAssociate(id);
      
      // Tentar enviar email de aprovação
      try {
        await sendApprovalEmail(associate);
      } catch (emailError) {
        console.warn('Email não enviado, mas associado foi aprovado:', emailError);
      }
      
      alert('Associado aprovado com sucesso!');
      fetchAssociates();
    } catch (error) {
      console.error('Erro ao aprovar:', error);
      alert('Erro ao aprovar associado');
    }
  };

  const handleReject = async (id: string, associate: Associate) => {
    const rejectionReason = prompt('Por favor, informe o motivo da rejeição:');
    
    if (!rejectionReason || rejectionReason.trim() === '') {
      alert('É necessário informar um motivo para rejeitar.');
      return;
    }
    
    try {
      await rejectAssociate(id);
      
      // Tentar enviar email de rejeição com o motivo
      try {
        await sendRejectionEmail({ ...associate, rejectionReason });
      } catch (emailError) {
        console.warn('Email não enviado, mas associado foi rejeitado:', emailError);
      }
      
      alert('Associado rejeitado!');
      fetchAssociates();
    } catch (error) {
      console.error('Erro ao rejeitar:', error);
      alert('Erro ao rejeitar associado');
    }
  };

  const handleDelete = async (id: string, logoUrl: string) => {
    if (!confirm('Deseja deletar este associado permanentemente?')) return;
    
    try {
      await deleteAssociate(id, logoUrl);
      alert('Associado deletado!');
      fetchAssociates();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Erro ao deletar associado');
    }
  };

  const handleDownloadExcel = () => {
    if (filteredAssociates.length === 0) {
      alert('Nenhum associado para exportar');
      return;
    }

    const data = filteredAssociates.map(a => ({
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
      'CPF Responsável': a.cpfResponsavel || '',
      'Telefone': a.telefone || '',
      'Email': a.email || '',
      'Cargo': a.cargo || '',
      'Instagram': a.instagram || '',
      'Status': a.status === 'pending' ? 'Pendente' : a.status === 'approved' ? 'Aprovado' : 'Rejeitado',
      'Data Criação': a.createdAt?.toDate().toLocaleDateString('pt-BR') || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Associados');
    XLSX.writeFile(wb, `associados_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredAssociates = associates.filter(a => {
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Gerenciar Associados
            </h1>
            <p className="text-slate-600">
              Aprove ou rejeite solicitações de novos associados
            </p>
          </div>
          
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Baixar Planilha
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Todos ({associates.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Pendentes ({associates.filter(a => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Aprovados ({associates.filter(a => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Rejeitados ({associates.filter(a => a.status === 'rejected').length})
          </button>
        </div>

        {/* Lista */}
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
              <div
                key={associate.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Logo */}
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

                  {/* Info Completa */}
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

                    {/* Dados Empresariais */}
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

                    {/* Endereço */}
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

                    {/* Responsável */}
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
                      {associate.cpfResponsavel && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">CPF:</span>{' '}
                          <span className="text-slate-800">{associate.cpfResponsavel}</span>
                        </p>
                      )}
                      {associate.cargo && (
                        <p className="text-sm">
                          <span className="font-semibold text-slate-600">Cargo:</span>{' '}
                          <span className="text-slate-800">{associate.cargo}</span>
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

                    {/* Contato da Empresa */}
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
                            Ver perfil
                            <ExternalLink className="h-3 w-3" />
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

                  {/* Actions */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {associate.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(associate.id!, associate)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          Aprovar
                        </button>
                        <button
                          onClick={() => handleReject(associate.id!, associate)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Rejeitar
                        </button>
                      </>
                    )}
                    {associate.status === 'approved' && (
                      <button
                        onClick={() => handleReject(associate.id!, associate)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Remover
                      </button>
                    )}
                    {associate.status === 'rejected' && (
                      <button
                        onClick={() => handleApprove(associate.id!, associate)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Aprovar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(associate.id!, associate.logo)}
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
    </main>
  );
};

export default AssociatesManagerPage;
