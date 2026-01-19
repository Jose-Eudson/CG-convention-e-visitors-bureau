import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { addAssociate, uploadAssociateLogo } from '../services/associatesService';
import { sendNewAssociateEmail } from '../services/associateEmailService';

const FormularioAssoc: React.FC = () => {
  const [categoria, setCategoria] = useState('');
  const [isEnviando, setIsEnviando] = useState(false);
  const [logoFile, setLogoFile] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/");
    setTimeout(() => {
      const element = document.getElementById("associados");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsEnviando(true);

    const formData = new FormData(formRef.current);

    try {
      let logoUrl = '';
      if (logoFile) {
        const nomeEmpresa = formData.get('nomeFantasia') as string || 'empresa';
        logoUrl = await uploadAssociateLogo(logoFile, nomeEmpresa);
      }

      const associateData = {
        name: formData.get('nomeFantasia') as string,
        category: formData.get('categoria') as string,
        logo: logoUrl,
        instagram: formData.get('instagram') as string || '',
        razaoSocial: formData.get('razaoSocial') as string,
        cnpj: formData.get('cnpj') as string,
        inscricaoEstadual: formData.get('inscricaoEstadual') as string || '',
        inscricaoMunicipal: formData.get('inscricaoMunicipal') as string || '',
        endereco: formData.get('endereco') as string,
        bairro: formData.get('bairro') as string,
        cep: formData.get('cep') as string,
        nomeResponsavel: formData.get('nomeResponsavel') as string,
        dataAniversarioResponsavel: formData.get('dataAniversarioResponsavel') as string || '',
        telefone: formData.get('telefone') as string,
        email: formData.get('email') as string,
        telefoneResponsavel: formData.get('telefoneResponsavel') as string || '',
        emailResponsavel: formData.get('emailResponsavel') as string || '',
        numeroFuncionarios: formData.get('numeroFuncionarios') as string || '',
      };

      const associateId = await addAssociate(associateData);

      try {
        await sendNewAssociateEmail({
          ...associateData,
          id: associateId
        } as any);
      } catch (emailError) {
        console.warn('Email não enviado, mas solicitação foi salva:', emailError);
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert("Erro ao enviar solicitação. Por favor, tente novamente.");
    } finally {
      setIsEnviando(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/#associados');
    setTimeout(() => {
      document.getElementById('associados')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const labelClass = "block text-sm font-bold text-slate-700 mb-1";
  const inputClass = "w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white";
  const sectionClass = "bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleVoltar}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors font-medium"
        >
          <FiArrowLeft size={20} />
          Voltar
        </button>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-t-xl shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Seja um Parceiro</h1>
          <p className="text-orange-100">
            Preencha os dados abaixo para solicitar sua associação ao Convention Bureau.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-b-xl shadow-lg">
          <div className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h2 className="text-xl font-bold text-slate-800">Identificação Empresarial</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="categoria" className={labelClass}>Categoria de Negócio</label>
                <select
                  id="categoria"
                  name="categoria"
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Selecione a categoria:</option>
                  <option value="Agência de Viagens, Receptivo e Aluguis de Automóveis">Agência de Viagens e Turismo</option>
                  <option value="Casas de Shows, Espetáculos e Museus">Casa de Eventos</option>
                  <option value="Guia de Turismo">Serviço de Guiamento Turístico (Guia de Turismo)</option>
                  <option value="Hospedagem">Hotel (até 70 unidades habitacionais)</option>
                  <option value="Hospedagem">Hotel (70 a 100 unidades habitacionais)</option>
                  <option value="Hospedagem">Hotel (acima de 100 unidades habitacionais)</option>
                  <option value="Institucional">Instituição (Shopping, Empresa, Universidade)</option>
                  <option value="Hospedagem">Pousada / Hostel</option>
                  <option value="Alimentação">Estabelecimento Gastronômico (Restaurante)</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {categoria === 'outro' && (
                <div>
                  <label htmlFor="categoriaOutro" className={labelClass}>Especifique a Categoria</label>
                  <input type="text" id="categoriaOutro" name="categoriaOutro" className={inputClass} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="razaoSocial" className={labelClass}>Razão Social</label>
                  <input type="text" id="razaoSocial" name="razaoSocial" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="nomeFantasia" className={labelClass}>Nome Fantasia</label>
                  <input type="text" id="nomeFantasia" name="nomeFantasia" required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cnpj" className={labelClass}>CNPJ</label>
                  <input type="text" id="cnpj" name="cnpj" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="inscricaoEstadual" className={labelClass}>Inscrição Estadual</label>
                  <input type="text" id="inscricaoEstadual" name="inscricaoEstadual" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="inscricaoMunicipal" className={labelClass}>Inscrição Municipal</label>
                  <input type="text" id="inscricaoMunicipal" name="inscricaoMunicipal" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="instagram" className={labelClass}>Link do Instagram ou Site (opcional)</label>
                <input type="url" id="instagram" name="instagram" placeholder="https://instagram.com/..." className={inputClass} />
              </div>

              <div>
                <label htmlFor="logo" className={labelClass}>Logo / Foto da Empresa</label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                <p className="text-xs text-slate-500 mt-1">Envie a logo que aparecerá na página de associados (PNG, JPG ou SVG)</p>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h2 className="text-xl font-bold text-slate-800">Localização e Contato</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bairro" className={labelClass}>Bairro</label>
                <input type="text" id="bairro" name="bairro" required className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="endereco" className={labelClass}>Endereço Completo</label>
                <input type="text" id="endereco" name="endereco" required className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cep" className={labelClass}>CEP</label>
                <input type="text" id="cep" name="cep" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="telefone" className={labelClass}>Telefone Fixo/Empresa</label>
                <input type="tel" id="telefone" name="telefone" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>E-mail Corporativo</label>
                <input type="email" id="email" name="email" required className={inputClass} />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h2 className="text-xl font-bold text-slate-800">Dados do Presidente / Responsável</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nomeResponsavel" className={labelClass}>Nome Completo do Responsável</label>
                  <input type="text" id="nomeResponsavel" name="nomeResponsavel" required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="dataAniversarioResponsavel" className={labelClass}>Data de Aniversário</label>
                  <input type="date" id="dataAniversarioResponsavel" name="dataAniversarioResponsavel" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="telefoneResponsavel" className={labelClass}>Telefone do Responsável</label>
                  <input type="tel" id="telefoneResponsavel" name="telefoneResponsavel" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="emailResponsavel" className={labelClass}>E-mail do Responsável</label>
                  <input type="email" id="emailResponsavel" name="emailResponsavel" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="numeroFuncionarios" className={labelClass}>Número de Funcionários</label>
                  <input type="number" id="numeroFuncionarios" name="numeroFuncionarios" className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <input
              type="checkbox"
              id="termos"
              required
              className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="termos" className="text-sm text-slate-700">
              Declaro que as informações acima são verdadeiras e estou ciente de que a admissão está sujeita à aprovação da diretoria.
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isEnviando}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isEnviando ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : "ENVIAR PROPOSTA"}
            </button>
            <button
              type="button"
              onClick={() => { formRef.current?.reset(); setCategoria(''); }}
              className="px-8 py-4 text-slate-500 font-semibold hover:text-slate-800 transition-colors"
            >
              Limpar Campos
            </button>
          </div>
        </form>
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
                    <FiCheckCircle className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Solicitação enviada com sucesso!</h3>
                  <p className="text-slate-600 mb-8">
                    Sua solicitação de associação foi recebida. Em breve entraremos em contato!
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all"
                  >
                    OK
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

export default FormularioAssoc;
