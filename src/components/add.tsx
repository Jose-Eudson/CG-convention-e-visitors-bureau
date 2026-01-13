import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AdicionarEmpresa: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [categoria, setCategoria] = useState('HOSPEDAGEM');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const nomeViaUrl = searchParams.get('nome');
    if (nomeViaUrl) setNomeEmpresa(nomeViaUrl);
  }, [searchParams]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Publicado com sucesso!");
  };

  return (
    /* mt-24 garante que fique abaixo do Header, py-10 dá respiro no final da página */
    <div className="mt-24 mb-10 px-4 min-h-[calc(100vh-150px)] flex flex-col items-center justify-center">
      
      <div className="flex flex-col md:flex-row gap-12 w-full max-w-5xl items-center md:items-start justify-center">
        
        {/* FORMULÁRIO */}
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-orange-500">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Aprovar Parceiro</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Empresa</label>
              <input 
                type="text" 
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoria</label>
              <input 
                type="text" 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value.toUpperCase())}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Link do Instagram</label>
              <input 
                type="url" 
                placeholder="https://instagram.com/..."
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Logo / Foto</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" />
            </div>

            <button type="submit" className="w-full bg-[#FF7A00] hover:bg-[#E66E00] text-white font-extrabold py-4 rounded-xl transition-all shadow-lg transform hover:scale-[1.02]">
              Publicar no Site
            </button>
          </form>
        </div>

        {/* PRÉVIA DO CARD */}
        <div className="flex flex-col items-center sticky top-28">
          <p className="text-xs text-gray-400 mb-4 font-black uppercase tracking-widest">Visualização no Site</p>
          <div className="bg-white w-72 p-5 rounded-[2rem] shadow-2xl border border-gray-50 transform scale-110 md:scale-100">
            <div className="bg-gray-100 aspect-square rounded-[1.5rem] mb-5 flex items-center justify-center overflow-hidden border border-gray-100">
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 font-medium">Sem logo</span>
              )}
            </div>
            
            <p className="text-[#89A1B6] text-[10px] font-bold tracking-widest mb-1 uppercase">{categoria}</p>
            <h3 className="text-[#002D57] text-xl font-black mb-6 leading-tight">{nomeEmpresa || 'Nome da Empresa'}</h3>
            
            <button className="bg-[#FFF1E3] text-[#FF7A00] px-8 py-2.5 rounded-2xl text-sm font-black transition-colors hover:bg-[#FFE4CC]">
              Saiba mais
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdicionarEmpresa;