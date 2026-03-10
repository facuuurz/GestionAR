import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada | GestionAR",
  description: "La página que buscas no existe o fue movida.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] flex flex-col items-center justify-center p-4 transition-colors duration-200">
      <div className="text-center max-w-md w-full space-y-8 animate-in fade-in zoom-in duration-500">

        {/* Logo / Ícono Central */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-pulse"></div>
          <div className="relative bg-white dark:bg-[#1e2736] p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 rotate-12 transform hover:rotate-0 transition-transform duration-300">
            <span className="material-symbols-outlined text-6xl text-blue-600 dark:text-blue-400">
              inventory_2
            </span>
          </div>
          {/* Símbolo de Error Superpuesto */}
          <div className="absolute -bottom-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg border-4 border-[#f6f6f8] dark:border-[#101622]">
            <span className="material-symbols-outlined text-xl">block</span>
          </div>
        </div>

        {/* Textos */}
        <div className="space-y-3">
          <h1 className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            ¡Ups! Lugar Equivocado 😒
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
            La página que estás buscando en GestionAR no existe, fue movida o no tienes los permisos necesarios para acceder a ella.
          </p>
        </div>

        {/* Botón de Acción */}
        <div className="pt-4">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl overflow-hidden shadow-sm transition-all hover:scale-105 active:scale-95 hover:shadow-md"
          >
            <span className="absolute inset-0 w-full h-full bg-black/10 dark:bg-black/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span>Volver al Panel Principal</span>
          </Link>
        </div>

        {/* Decoration Footer */}
        <div className="pt-12 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600">
          <span className="w-12 h-px bg-slate-200 dark:bg-slate-700"></span>
          <span className="font-bold tracking-widest text-xs uppercase">GestionAR</span>
          <span className="w-12 h-px bg-slate-200 dark:bg-slate-700"></span>
        </div>
      </div>
    </div>
  );
}
