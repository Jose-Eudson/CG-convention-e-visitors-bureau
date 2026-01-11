import { useEffect } from "react";
import { FaInstagram, FaFacebook, FaPhoneAlt } from "react-icons/fa";

interface LocalModalProps {
  local: {
    id: number;
    nome: string;
    categoria: string;
    resumo: string;
    descricao: string;
    imagem: string;
    endereco: string;
    googleMapsUrl: string;
    instagram?: string | null;
    facebook?: string | null;
    telefone?: string | null;
  };
  onClose: () => void;
}

const getEmbedUrl = (mapsUrl: string) => {
  if (mapsUrl.includes("output=embed")) return mapsUrl;
  return `${mapsUrl}&output=embed`;
};

const LocalModal = ({ local, onClose }: LocalModalProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white max-w-3xl w-full max-h-[90vh] rounded-xl overflow-hidden relative">

        <div className="overflow-y-auto max-h-[90vh]">

          <img
            src={local.imagem}
            alt={local.nome}
            className="w-full h-64 object-cover"
          />

          <div className="p-6">
            <h2 className="text-2xl font-bold text-pink-500">
              {local.nome}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {local.resumo}
            </p>

            <span className="inline-block mt-2 text-xs font-semibold uppercase text-emerald-600">
              {local.categoria}
            </span>

            <p className="mt-4 text-slate-700">
              {local.descricao}
            </p>

            {/* Endereço + Contatos */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

              {/* Endereço */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Endereço
                </h4>
                <p className="text-gray-600 text-sm">
                  {local.endereco}
                </p>
              </div>

              {/* Contatos */}
              {(local.instagram || local.facebook || local.telefone) && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Contato
                  </h4>

                  <div className="flex flex-wrap gap-4">
                    {local.instagram && (
                      <a
                        href={local.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-pink-600 hover:underline"
                      >
                        <FaInstagram />
                        <span>Instagram</span>
                      </a>
                    )}

                    {local.facebook && (
                      <a
                        href={local.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <FaFacebook />
                        <span>Facebook</span>
                      </a>
                    )}

                    {local.telefone && (
                      <a
                        href={`tel:${local.telefone.replace(/\D/g, "")}`}
                        className="flex items-center gap-2 text-emerald-600 hover:underline"
                      >
                        <FaPhoneAlt />
                        <span>{local.telefone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mapa */}
            <div className="mt-6">
              <iframe
                src={getEmbedUrl(local.googleMapsUrl)}
                width="100%"
                height="300"
                loading="lazy"
                className="rounded-lg border"
              />
            </div>
          </div>
        </div>

        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center text-slate-600 hover:text-red-500 shadow"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LocalModal;
