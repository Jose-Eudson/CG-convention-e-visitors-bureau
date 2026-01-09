import logo from "../assets/logo_cvbcg.svg";
import { Globe } from "lucide-react";

const HeaderProposta = () => {
 
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex w-full items-center justify-between px-6 py-5 lg:px-12">
        
        <a href="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <div className="hidden flex-col sm:flex text-left font-bold text-slate-900 text-xs">
            <span className="group-hover:text-emerald-600 transition-colors uppercase">Campina Grande</span>
            <span className="text-slate-500 font-medium uppercase">Convention & Visitors Bureau</span>
          </div>
        </a>

        <div className="flex items-center gap-2 text-slate-400">
          <Globe className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Portal do Associado
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderProposta;