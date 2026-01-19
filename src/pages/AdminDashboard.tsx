import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Área Administrativa</h1>
      <div className="flex gap-8">
        <button
          onClick={() => navigate("/admin/eventos")}
          className="px-8 py-4 rounded-lg bg-indigo-600 text-white text-lg font-semibold shadow hover:bg-indigo-700 transition-colors"
        >
          Gerenciar Eventos
        </button>
        <button
          onClick={() => navigate("/admin/associados")}
          className="px-8 py-4 rounded-lg bg-emerald-600 text-white text-lg font-semibold shadow hover:bg-emerald-700 transition-colors"
        >
          Gerenciar Associados
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
