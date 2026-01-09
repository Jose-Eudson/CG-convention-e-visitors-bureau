const FooterSimples = () => {
  return (
    <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <p className="text-slate-400 text-sm">
          © 2026 Campina Grande CVB
        </p>
        <a 
          href="/" 
          className="text-orange-500 hover:text-orange-400 font-bold transition-colors"
        >
          ← Voltar ao Início
        </a>
      </div>
    </footer>
  );
};

export default FooterSimples;