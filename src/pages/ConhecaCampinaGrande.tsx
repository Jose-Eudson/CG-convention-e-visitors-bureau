import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import locais from "../assets/data/locais.json";
import LocalModal from "../components/LocalModal";

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
    const [localSelecionado, setLocalSelecionado] =
        useState<LocalTuristico | null>(null);

    // categorias dinâmicas vindas do JSON
    const categorias = useMemo(() => {
        const cats = locais.map((local: LocalTuristico) => local.categoria);
        return ["Todas", ...Array.from(new Set(cats))];
    }, []);

    // locais filtrados
    const locaisFiltrados = useMemo(() => {
        return locais.filter((local: LocalTuristico) => {
            const matchCategoria =
                categoriaAtiva === "Todas" || local.categoria === categoriaAtiva;

            const matchBusca =
                local.nome.toLowerCase().includes(search.toLowerCase()) ||
                local.resumo.toLowerCase().includes(search.toLowerCase());

            return matchCategoria && matchBusca;
        });
    }, [search, categoriaAtiva]);

    return (
        <main className="bg-white py-12 md:py-24">
            <div className="mx-auto max-w-6xl px-4 md:px-6">

                {/* BOTÃO VOLTAR */}
                <div className="fixed left-4 top-24 z-40">
                    <Link
                        to="/"
                        className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow text-pink-500 hover:bg-pink-50"
                    >
                        <FiArrowLeft size={18} />
                        Voltar
                    </Link>
                </div>

                {/* TÍTULO */}
                <h1 className="mb-8 text-3xl font-bold text-pink-500">
                    Conheça Campina Grande
                </h1>

                {/* BUSCA + FILTROS */}
                <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    {/* BUSCA */}
                    <div className="relative w-full md:max-w-sm">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar locais..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-pink-500 focus:outline-none"
                        />
                    </div>

                    {/* FILTRO CATEGORIAS */}
                    <div className="flex flex-wrap gap-2">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria}
                                onClick={() => setCategoriaAtiva(categoria)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition
                  ${categoriaAtiva === categoria
                                        ? "bg-pink-500 text-white"
                                        : "bg-pink-100 text-pink-600 hover:bg-pink-200"
                                    }
                `}
                            >
                                {capitalize(categoria)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID DE LOCAIS */}
                {locaisFiltrados.length === 0 ? (
                    <p className="text-gray-500">
                        Nenhum local encontrado.
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {locaisFiltrados.map((local: LocalTuristico) => (
                            <button
                                key={local.id}
                                onClick={() => setLocalSelecionado(local)}
                                className="overflow-hidden rounded-xl border text-left shadow-sm transition hover:shadow-md"
                            >
                                <img
                                    src={local.imagem}
                                    alt={local.nome}
                                    className="h-48 w-full object-cover"
                                />

                                <div className="p-4">
                                    <h3 className="mb-1 font-semibold text-gray-900">
                                        {local.nome}
                                    </h3>
                                    <span className="mb-2 inline-block text-xs font-medium text-pink-500">
                                        {local.categoria}
                                    </span>
                                    <p className="text-sm text-gray-600">
                                        {local.resumo}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* MODAL */}
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
