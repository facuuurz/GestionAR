"use client";

import { FormEvent } from "react";

interface Props {
  eliminarAction: (formData: FormData) => void;
}

export default function BotonEliminar({ eliminarAction }: Props) {
  
  const handleSubmit = (e: FormEvent) => {
    const confirmado = confirm("¿Estás seguro de que quieres eliminar esta cuenta? Esta acción no se puede deshacer.");
    if (!confirmado) {
      e.preventDefault(); // Cancela el envío si dice que NO
    }
  };

  return (
    <form action={eliminarAction} onSubmit={handleSubmit}>
      <button 
        type="submit"
        className="w-full md:w-auto px-5 py-2.5 rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
        Eliminar Cuenta Corriente
      </button>
    </form>
  );
}