import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiMapPin } from "react-icons/fi";
import LocalModal from "../components/LocalModal";

const locaisUrl = "/assets/data/locais.json";

const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);

interface LocalTuristico {
    id: number;
    nome: string;
    categoria: string;
    resumo: string;
    descricao: string;
    imagem: string;
    endereco: string;
    googleMapsUrl: string;
}

const ConhecaCampinaGrande = () => {
    const [search, setSearch] = useState("");
    const [categoriaAtiva, setCategoriaAtiva] = useState("Todas");
    const [localSelecionado, setLocalSelecionado] = useState<LocalTuristico | null>(null);
    const [locais, setLocais] = useState<LocalTuristico[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(locaisUrl)
            .then((res) => res.json())
            .then((data) => {
                setLocais(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erro ao carregar locais:", err);
                setLoading(false);
            });
    }, []);

    const categorias = useMemo(() => {
        const cats = locais.map((local: LocalTuristico) => local.categoria);
        return ["Todas", ...Array.from(new Set(cats))];
    }, [locais]);

    const locaisFiltrados = useMemo(() => {
        return locais.filter((local: LocalTuristico) => {
            const matchCategoria =
                categoriaAtiva === "Todas" || local.categoria === categoriaAtiva;

            const matchBusca =
                local.nome.toLowerCase().includes(search.toLowerCase()) ||
                local.resumo.toLowerCase().includes(search.toLowerCase());

            return matchCategoria && matchBusca;
        });
    }, [search, categoriaAtiva, locais]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <main className="relative min-h-screen bg-slate-50 pt-24 pb-16 md:pt-28 md:pb-24">
            <div className="absolute inset-0 pointer-events-none bg-slate-200/50 mix-blend-multiply"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <Link
                        to="/"
                        className="self-start inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-emerald-600 transition-all active:scale-95"
                    >
                        <FiArrowLeft size={18} />
                        Voltar ao Início
                    </Link>
                </div>

                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-3">
                        Conheça Campina Grande
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl">
                        Explore os melhores pontos turísticos, cultura e história da Rainha da Borborema.
                    </p>
                </div>

                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                    <div className="relative w-full lg:max-w-md">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Buscar locais, museus, parques..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border-0 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 transition sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria}
                                onClick={() => setCategoriaAtiva(categoria)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                                    ${categoriaAtiva === categoria
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"}
                                `}
                            >
                                {capitalize(categoria)}
                            </button>
                        ))}
                    </div>
                </div>

                {locaisFiltrados.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <FiSearch className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">Nenhum local encontrado</h3>
                        <p className="text-slate-500">Tente buscar por outro termo ou mude a categoria.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {locaisFiltrados.map((local: LocalTuristico) => (
                            <div
                                key={local.id}
                                onClick={() => setLocalSelecionado(local)}
                                className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/5 hover:ring-emerald-500/50"
                            >
                                <div className="relative h-56 w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-200" />
                                    <img
                                        src={local.imagem}
                                        alt={local.nome}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-20" />
                                    <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-700 backdrop-blur-sm shadow-sm z-30">
                                        {local.categoria}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="mb-2 text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                        {local.nome}
                                    </h3>
                                    
                                    <p className="mb-4 text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">
                                        {local.resumo}
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 text-xs font-medium text-slate-500 pt-4 border-t border-slate-100">
                                        <FiMapPin className="text-emerald-600" />
                                        <span className="truncate">{local.endereco ? local.endereco.split(',')[0] : 'Campina Grande - PB'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {localSelecionado && (
                    <LocalModal
                        local={localSelecionado}
                        onClose={() => setLocalSelecionado(null)}
                    />
                )}
            </div>
        </main>
    );
};

export default ConhecaCampinaGrande;