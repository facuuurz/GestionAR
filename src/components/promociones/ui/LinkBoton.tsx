import Link from "next/link";
import React from "react";

interface LinkBotonProps {
  href: string;
  texto: string;
  icono?: string;
  className?: string;
}

export default function LinkBoton({ href, texto, icono, className = "" }: LinkBotonProps) {
  return (
    <Link 
      href={href}
      className={`group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm ${className}`}
    >
      {icono && (
        <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110">
          {icono}
        </span>
      )}
      <span className="text-sm font-bold truncate">{texto}</span>
    </Link>
  );
}