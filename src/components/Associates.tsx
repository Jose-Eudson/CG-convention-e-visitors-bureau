import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";


type CategoryKey =
  | "hospedagem"
  | "alimentacao"
  | "agencias"
  | "casasShows"
  | "organizacao"
  | "equipamentos"
  | "consultoria"
  | "guia"
  | "tecnologia";

type CategoryOption = {
  key: CategoryKey;
  valuePt: string; 
};


const CATEGORY_MAP: CategoryOption[] = [
  { key: "hospedagem", valuePt: "Hospedagem" },
  { key: "alimentacao", valuePt: "Alimentação" },
  {
    key: "agencias",
    valuePt: "Agências de Viagens, Receptivo e Aluguéis de Automóveis",
  },
  { key: "casasShows", valuePt: "Casas de Shows, Espetáculos e Museus" },
  { key: "organizacao", valuePt: "Organização e Produção de Eventos" },
  { key: "equipamentos", valuePt: "Equipamentos, Segurança e Cerimonial" },
  { key: "consultoria", valuePt: "Consultoria em Turismo e Marketing" },
  { key: "guia", valuePt: "Guia de Turismo" },
  { key: "tecnologia", valuePt: "Tecnologia" },
];

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
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const perPage = 8;
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  
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
    const s = debouncedSearch.trim().toLowerCase();
    return associates.filter((a) => {
      const matchesName = a.name.toLowerCase().includes(s);
      const matchesCategory = category ? a.category === category : true;
      return matchesName && matchesCategory;
    });
  }, [associates, debouncedSearch, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  
  const getCategoryLabel = (catValueInJson: string) => {
    const found = CATEGORY_MAP.find((c) => c.valuePt === catValueInJson);
    return found
      ? t(`categories.${found.key}`, { defaultValue: catValueInJson })
      : catValueInJson;
  };

  return (
    <section id="associados" className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-14">
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          {t("title", { defaultValue: "Conheça nossos parceiros" })}
        </h2>


        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder", {
              defaultValue: "Buscar associado...",
            })}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2 shadow-sm text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
          />

          <div className="w-full md:w-96 relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-slate-300 px-4 py-2 bg-white"
            >
              <span className="truncate">
                {category
                  ? getCategoryLabel(category)
                  : t("allCategories", { defaultValue: "Todas as categorias" })}
              </span>
              <ChevronDown className="h-5 w-5 text-slate-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden max-h-80 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setCategory(null);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600 ${
                    !category
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-700"
                  }`}
                >
                  {t("allCategories", { defaultValue: "Todas as categorias" })}
                </button>

                {CATEGORY_MAP.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setCategory(opt.valuePt); 
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-orange-600 ${
                      category === opt.valuePt
                        ? "bg-orange-50 text-orange-600"
                        : "text-slate-700"
                    }`}
                  >
                    {t(`categories.${opt.key}`, { defaultValue: opt.valuePt })}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginated.map((associate, idx) => (
            <article
              key={`${associate.name}-${idx}`}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="h-40 w-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden mb-4">
                  {associate.logo ? (
                    <img
                      src={associate.logo}
                      alt={`Logo ${associate.name}`}
                      className="max-h-full max-w-full object-contain p-4"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-slate-400 text-sm italic">
                      Sem logo
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="block text-xs font-bold tracking-wide text-slate-400 uppercase mb-1">
                    {getCategoryLabel(associate.category)}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">
                    {associate.name}
                  </h3>
                </div>

                <div className="mt-auto">
                  {associate.instagram && (
                    <a
                      href={associate.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-orange-100 text-orange-700 px-4 py-2 text-sm font-semibold hover:bg-orange-200 transition-colors"
                    >
                      {t("learnMore", { defaultValue: "Saiba mais" })}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {paginated.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            {t("noResults", { defaultValue: "Nenhum parceiro encontrado." })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={t("prevPage", { defaultValue: "Página anterior" })}
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
            <span className="text-sm font-medium text-slate-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={t("nextPage", { defaultValue: "Próxima página" })}
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        )}

       
          
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


