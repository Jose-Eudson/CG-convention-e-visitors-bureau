import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getApprovedAssociates } from "../services/associatesService";

const brasilCvbLogo = "/assets/logos_partnerships/logo-brasil-cvb.png";
const accgLogo = "/assets/logos_partnerships/accg_min.png";
const sindcampinaLogo = "/assets/logos_partnerships/sind_campina.png";

type CategoryKey =
  | "institucional"
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
  {
    key: "agencias",
    valuePt: "Agências de Viagens, Receptivo e Aluguéis de Automóveis",
  },
  { key: "alimentacao", valuePt: "Alimentação" },
  { key: "casasShows", valuePt: "Casas de Shows, Espetáculos e Museus" },
  { key: "consultoria", valuePt: "Consultoria em Turismo e Marketing" },
  { key: "equipamentos", valuePt: "Equipamentos, Segurança e Cerimonial" },
  { key: "guia", valuePt: "Guia de Turismo" },
  { key: "hospedagem", valuePt: "Hospedagem" },
  { key: "institucional", valuePt: "Institucional" },
  { key: "organizacao", valuePt: "Organização e Produção de Eventos" },
  { key: "tecnologia", valuePt: "Tecnologia" },
];

type Associate = {
  name: string;
  category: string;
  logo: string;
  instagram: string;
};

const Associates = () => {
  const { t } = useTranslation("associates");
  const navigate = useNavigate();

  const institutionalPartners: Associate[] = [
    {
      name: "Brasil CVB",
      category: "Institucional",
      logo: brasilCvbLogo,
      instagram: "https://brasilcvb.com.br/",
    },
    {
      name: "ACCG",
      category: "Institucional",
      logo: accgLogo,
      instagram: "https://accg.com.br/",
    },
    {
      name: "SindCampina",
      category: "Institucional",
      logo: sindcampinaLogo,
      instagram: "https://www.sindcampina.com.br/2019/site.php",
    },
  ];

  const [firestoreAssociates, setFirestoreAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        setLoading(true);
        const data = await getApprovedAssociates();
        setFirestoreAssociates(data);
      } catch (error) {
        console.error('Erro ao buscar associados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociates();
  }, []);

  const rawAssociates = t("associates", { returnObjects: true });
  const associatesFromJson: Associate[] = Array.isArray(rawAssociates)
    ? (rawAssociates as Associate[])
    : [];

  const associates: Associate[] = [
    ...associatesFromJson,
    ...institutionalPartners,
    ...firestoreAssociates
  ];

  const rawBenefits = t("benefits", { returnObjects: true });
  const benefits: string[] = Array.isArray(rawBenefits)
    ? (rawBenefits as string[])
    : [];

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const perPage = 8;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

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

  const getCategoryLabel = (catValueInJson: string) => {
    const found = CATEGORY_MAP.find((c) => c.valuePt === catValueInJson);
    return found
      ? t(`categories.${found.key}`, { defaultValue: catValueInJson })
      : catValueInJson;
  };

  return (
    <section id="associados" className="bg-slate-100 py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="mb-4 text-2xl md:text-3xl font-bold text-orange-600">
          {t("title", { defaultValue: "Conheça nossos parceiros" })}
        </h2>

        <p className="mb-12 text-slate-500">
          {t("subtitle", { defaultValue: "" })}
        </p>

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
                  : t("allCategories", {
                      defaultValue: "Todas as categorias",
                    })}
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
                  {t("allCategories", {
                    defaultValue: "Todas as categorias",
                  })}
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
                    {t(`categories.${opt.key}`, {
                      defaultValue: opt.valuePt,
                    })}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse"
              >
                <div className="p-5">
                  <div className="h-40 w-full rounded-xl bg-slate-200 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2 w-20"></div>
                  <div className="h-6 bg-slate-200 rounded mb-4 w-full"></div>
                  <div className="h-8 bg-slate-200 rounded w-24"></div>
                </div>
              </div>
            ))
          ) : (
            paginated.map((associate, idx) => (
              <article
                key={`${associate.name}-${idx}`}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="p-5 flex-1 flex flex-col">
                  <div className="h-40 w-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden mb-4 p-6">
                    {associate.logo ? (
                      <img
                        src={associate.logo}
                        alt={`Logo ${associate.name}`}
                        className="max-h-full max-w-full object-contain"
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
            ))
          )}
        </div>

        {!loading && paginated.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            {t("noResults", {
              defaultValue: "Nenhum parceiro encontrado.",
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={t("prevPage", {
                defaultValue: "Página anterior",
              })}
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
              aria-label={t("nextPage", {
                defaultValue: "Próxima página",
              })}
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        )}

        <div className="mt-16 rounded-2xl bg-orange-50 border border-orange-100 p-8 md:p-12">
          <h3 className="mb-4 text-2xl font-bold text-slate-800">
            {t("callTitle")}
          </h3>
          <p className="mb-6 text-slate-600">{t("callText")}</p>

          {benefits.length > 0 && (
            <ul className="mb-8 space-y-2">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-slate-700"
                >
                  <span className="text-orange-500 font-bold">✓</span>{" "}
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => navigate("/proposta")}
            className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white transition-all hover:bg-orange-600 hover:shadow-lg active:scale-95"
          >
            {t("button", {
              defaultValue: "Preencher formulário de associado",
            })}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Associates;
