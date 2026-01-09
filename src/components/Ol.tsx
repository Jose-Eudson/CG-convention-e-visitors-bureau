import React from 'react';
import eventoImg from '../assets/campina_cvb.jpg';

const Ol = () => {
  return (
    <section className="relative flex min-h-screen items-center bg-slate-50 text-slate-900 pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 items-center">
        
        {}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight text-slate-800">
            Faça Parte Você <br />
            <span className="text-orange-500">Também!</span>
          </h1>
          <p className="text-lg text-slate-600">
            Junte-se a nós e impulsione o turismo de negócios em Campina Grande.
          </p>
          
          {}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4 bg-white shadow-sm">
              <p className="text-sm font-semibold text-slate-800">Visibilidade:</p>
              <p className="text-xs text-slate-500">Destaque no guia oficial.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 bg-white shadow-sm">
              <p className="text-sm font-semibold text-slate-800">Networking:</p>
              <p className="text-xs text-slate-500">Participe de eventos exclusivos.</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4 bg-white shadow-sm">
              <p className="text-sm font-semibold text-slate-800">Voz Ativa:</p>
              <p className="text-xs text-slate-500">Participação em decisões estratégicas</p>
            </div>
          </div>

          <a 
            href="./public/form/ol.html" 
            className="inline-block rounded-lg bg-orange-500 px-8 py-4 font-bold text-white transition-all hover:bg-orange-600 shadow-md text-center">
            Formulário de Associação
        </a>
        </div>

        {}
        <div className="relative overflow-hidden rounded-3xl border-8 border-white shadow-xl bg-white">
          <img 
            src={eventoImg} 
            alt="Campina Grande" 
            className="h-[450px] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};


export default Ol;