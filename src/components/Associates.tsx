import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const TEXTOS = {
  titulo: "Nossos Associados",
  tituloChamada: "Seja um Associado",
  textoChamada: "Junte-se ao Campina Grande Convention & Visitors Bureau e fortaleça o turismo na nossa região.",
  botaoTexto: "Quero me associar",
  beneficios: [
    "Assessoria técnica especializada",
    "Divulgação no portal oficial do destino",
    "Participação em eventos e feiras do setor",
    "Networking com a cadeia produtiva local"
  ]
};

const CATEGORIES = [
  "Hospedagem",
  "Alimentação",
  "Agências de Viagens, Receptivo e Aluguéis de Automóveis",
  "Casas de Shows, Espetáculos e Museus",
  "Organização e Produção de Eventos",
  "Equipamentos, Segurança e Cerimonial",
  "Consultoria em Turismo e Marketing",
  "Guia de Turismo",
  "Tecnologia",
];

const Associates = () => {
  const [category, setCategory] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section id="associados" className="bg-slate-50 py-6 md:py-9">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 md:mb-12 text-2xl md:text-3xl font-bold text-orange-500">
          {TEXTOS.titulo}
        </h2>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative w-full md:w-1/3" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-slate-300 px-4 py-2 bg-white"
            >
              <span>{category || "Todas as categorias"}</span>
              <ChevronDown size={20} className={isDropdownOpen ? "rotate-180" : ""} />
            </button>

            {isDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow-lg max-h-60 overflow-y-auto">
                <li
                  onClick={() => { setCategory(null); setIsDropdownOpen(false); }}
                  className="cursor-pointer px-4 py-2 hover:bg-orange-50"
                >
                  Todas as categorias
                </li>
                {CATEGORIES.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => { setCategory(cat); setIsDropdownOpen(false); }}
                    className="cursor-pointer px-4 py-2 hover:bg-orange-50"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-12 text-center text-slate-400">
        </div>

        <div className="rounded-2xl bg-orange-50 border p-8 md:p-12">
          <h3 className="mb-4 text-2xl font-bold">{TEXTOS.tituloChamada}</h3>
          <p className="mb-6">{TEXTOS.textoChamada}</p>
          <ul className="mb-8 space-y-2">
            {TEXTOS.beneficios.map((benefit, index) => (
              <li key={index} className="flex items-center">
                <span className="text-orange-500 mr-2">✓</span> {benefit}
              </li>
            ))}
          </ul>
          <button
            onClick={() => (window.location.href = "/form/ol.html")}
            className="rounded-xl bg-orange-500 px-8 py-3 font-bold text-white shadow-md hover:bg-orange-600 transition-all"
          >
            {TEXTOS.botaoTexto}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Associates;