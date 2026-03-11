import React from "react";

interface BotonAccionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  texto: string;
  textoCargando?: string;
  isPending?: boolean;
  icono?: string;
}

export default function BotonAccion({
  texto,
  textoCargando = "Guardando...",
  isPending = false,
  icono = "save",
  className = "",
  ...props
}: BotonAccionProps) {
  return (
    <button
      disabled={isPending}
      className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-sm
        ${isPending 
          ? 'bg-neutral-500 cursor-not-allowed' 
          : 'bg-neutral-800 hover:bg-black dark:bg-[#135bec] dark:hover:bg-blue-600'
        } ${className}`}
      {...props}
    >
      {isPending ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
          {textoCargando}
        </>
      ) : (
        <>
          {icono && <span className="material-symbols-outlined text-[18px]">{icono}</span>}
          {texto}
        </>
      )}
    </button>
  );
}