import { useTranslation } from "react-i18next";
import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";


type Associate = {
  name: string;
  category: string;
  logo: string;
  instagram: string;
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
  const { t } = useTranslation("associates");
  const navigate = useNavigate();

  
  const rawAssociates = t("associates", { returnObjects: true });
  const associates: Associate[] = Array.isArray(rawAssociates) ? (rawAssociates as Associate[]) : [];

  const rawBenefits = t("benefits", { returnObjects: true });
  const benefits: string[] = Array.isArray(rawBenefits) ? (rawBenefits as string[]) : [];

  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const perPage = 8;
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

  
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  
  const filtered = useMemo(() => {
    return associates
      .filter((a) => a.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
      .filter((a) => !category || a.category === category);
  }, [debouncedSearch, category, associates]);

  
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <section id="associados" className="bg-slate-50 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-8 md:mb-12 text-2xl md:text-3xl font-bold text-orange-500">
          {t("title")}
        </h2>

        
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <input
            type="text"
            placeholder="Buscar associado..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <div className="relative w-full md:w-1/3" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-slate-300 px-4 py-2 bg-white"
            >
              <span>{category || "Todas as categorias"}</span>
              <ChevronDown size={20} className={isDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {isDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full rounded-xl border bg-white shadow-lg max-h-60 overflow-y-auto">
                <li
                  onClick={() => { setCategory(null); setPage(1); setIsDropdownOpen(false); }}
                  className="cursor-pointer px-4 py-2 hover:bg-orange-50"
                >
                  Todas as categorias
                </li>
                {CATEGORIES.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); setIsDropdownOpen(false); }}
                    className="cursor-pointer px-4 py-2 hover:bg-orange-50"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        
        <div className="mb-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginated.map((associate) => (
            <div key={associate.name} className="rounded-xl border bg-white p-5 shadow hover:shadow-lg transition-shadow">
              <div className="flex justify-center h-24">
                {associate.logo ? (
                  <img src={associate.logo} alt={associate.name} className="h-full object-contain" />
                ) : (
                  <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">Logo</div>
                )}
              </div>
              <p className="mt-4 text-[10px] uppercase font-bold text-slate-400">{associate.category}</p>
              <p className="text-lg font-semibold text-slate-800 line-clamp-1">{associate.name}</p>
              {associate.instagram && (
                <a
                  href={associate.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-lg bg-orange-100 px-4 py-2 text-sm text-orange-600 font-medium hover:bg-orange-200"
                >
                  Saiba mais
                </a>
              )}
            </div>
          ))}
        </div>

        
        <div className="flex justify-center gap-4 mb-16 items-center">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
            className="p-2 disabled:opacity-20 hover:text-orange-500"
          >
            <ChevronLeft />
          </button>
          <span className="text-sm font-medium text-slate-600">Página {page}</span>
          <button 
            disabled={page * perPage >= filtered.length} 
            onClick={() => setPage(page + 1)}
            className="p-2 disabled:opacity-20 hover:text-orange-500"
          >
            <ChevronRight />
          </button>
        </div>

        
        <div className="rounded-2xl bg-orange-50 border border-orange-100 p-8 md:p-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-800">{t("callTitle")}</h3>
          <p className="mb-6 text-slate-600">{t("callText")}</p>
          <ul className="mb-8 space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-slate-700">
                <span className="text-orange-500 font-bold">✓</span> {benefit}
              </li>
            ))}
          </ul>
          <button
            onClick={() => navigate("/proposta")} 
            className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition-all hover:bg-orange-600 hover:shadow-lg active:scale-95"
          >
            {t("button")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Associates;