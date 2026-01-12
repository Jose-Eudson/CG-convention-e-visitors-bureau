import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 

const FormularioAssoc: React.FC = () => {
  const [categoria, setCategoria] = useState<string>('');
  const [isEnviando, setIsEnviando] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate(); 

  const URL_GAS_FINAL = "https://script.google.com/macros/s/AKfycbxp6CZifbRBgJbU0Bj9jf2ZZvHCyYZ5ZsNIbyDCF2lWGsaP0gKjou2opgxD5d5_mtPtAg/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsEnviando(true);
    const dados = new FormData(formRef.current);

    try {
      await fetch(URL_GAS_FINAL, {
        method: "POST",
        body: dados,
        mode: 'no-cors' 
      });
      alert("Boa! Recebemos o teu interesse. Vamos falar em breve!");
      navigate("/"); 
    } catch (err) {
      alert("Erro ao enviar. Por favor, tente novamente.");
    } finally {
      setIsEnviando(false);
    }
  };

  const labelClass = "block text-sm font-bold text-slate-700 mb-1";
  const inputClass = "w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white";
  const sectionClass = "bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
       
        <div className="text-center mb-10">
          <img 
            src="https://www.cvbcg.com.br/assets/img/logo_cvbcg.svg" 
            alt="CVB Campina" 
            className="max-w-[150px] mx-auto mb-6"
          />
          <h1 className="text-3xl font-extrabold text-slate-800">Seja um Parceiro</h1>
          <p className="text-slate-500 mt-2">Preencha os dados abaixo para solicitar sua associação ao Convention Bureau.</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          
          
          <section className={sectionClass}>
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold">1</span>
              <h2 className="text-xl font-bold text-slate-800">Identificação Empresarial</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Categoria de Negócio</label>
                <select 
                  name="categoria" required value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>Selecione a categoria:</option>
                  <option>Agência de Viagens e Turismo</option>
                  <option>Casa de Eventos</option>
                  <option>Serviço de Guiamento Turístico (Guia de Turismo)</option>
                  <option>Hotel (até 70 unidades habitacionais)</option>
                  <option>Hotel (70 a 100 unidades habitacionais)</option>
                  <option>Hotel (acima de 100 unidades habitacionais)</option>
                  <option>Instituição (Shopping, Empresa, Universidade)</option>
                  <option>Pousada / Hostel</option>
                  <option>Estabelecimento Gastronômico (Restaurante)</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {categoria === 'outro' && (
                <div className="md:col-span-2 animate-in slide-in-from-top-2 duration-300">
                  <label className={labelClass}>Especifique a Categoria</label>
                  <input type="text" name="outro" required className={inputClass} />
                </div>
              )}

              <div className="md:col-span-2">
                <label className={labelClass}>Razão Social</label>
                <input type="text" name="razaoSocial" required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Nome Fantasia</label>
                <input type="text" name="nomeFantasia" required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>CNPJ</label>
                <input type="text" name="cnpj" required placeholder="00.000.000/0000-00" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Inscrição Estadual</label>
                <input type="text" name="inscEstadual" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Inscrição Municipal</label>
                <input type="text" name="inscMunicipal" className={inputClass} />
              </div>
            </div>
          </section>

         
          <section className={sectionClass}>
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold">2</span>
              <h2 className="text-xl font-bold text-slate-800">Localização e Contato</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Endereço Completo</label>
                <input type="text" name="endereco" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>CEP</label>
                <input type="text" name="cep" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Telefone Fixo/Empresa</label>
                <input type="tel" name="foneEntidade" required className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>E-mail Corporativo</label>
                <input type="email" name="emailEntidade" required className={inputClass} />
              </div>
            </div>
          </section>

        
          <section className={sectionClass}>
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold">3</span>
              <h2 className="text-xl font-bold text-slate-800">Dados do Presidente / Responsável</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Nome Completo do Responsável</label>
                <input type="text" name="presidente" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Celular / WhatsApp</label>
                <input type="tel" name="fonePresidente" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>E-mail Pessoal/Diretoria</label>
                <input type="email" name="emailPresidente" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nº total de Funcionários</label>
                <input type="number" name="funcionarios" required className={inputClass} />
              </div>
            </div>
          </section>

          
          <div className="flex flex-col items-center gap-6 pt-4">
            <div className="flex items-start gap-2 text-sm text-slate-500 max-w-lg text-center">
              <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500" />
              <span>Declaro que as informações acima são verdadeiras e estou ciente de que a admissão está sujeita à aprovação da diretoria.</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <button 
                type="submit" 
                disabled={isEnviando}
                className="inline-flex justify-center items-center px-12 py-4 border border-transparent text-lg font-bold rounded-xl shadow-lg text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnviando ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </>
                ) : "ENVIAR PROPOSTA"}
              </button>

              <button
                type="button"
                onClick={() => {formRef.current?.reset(); setCategoria('')}}
                className="px-8 py-4 text-slate-500 font-semibold hover:text-slate-800 transition-colors"
              >
                Limpar Campos
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioAssoc;