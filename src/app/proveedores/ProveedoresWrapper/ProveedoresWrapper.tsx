"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import OrdenarProveedores from "@/components/Ordenar/OrdenarProveedores";

export default function SortProveedoresWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const valorActual = searchParams.get("sort")?.toString();
  
  // El punto azul solo aparece si hay un valor Y no es el default ("razon-social-asc")
  const hasActiveSort = !!valorActual && valorActual !== "razon-social-asc";

  const handleAplicar = (criterio: string, cerrarModal: boolean = true) => {
    const params = new URLSearchParams(searchParams);
    
    // Si el criterio es vacío o es el default, borramos el param de la URL
    if (criterio && criterio !== "razon-social-asc") {
      params.set("sort", criterio);
    } else {
      params.delete("sort");
    }
    
    replace(`${pathname}?${params.toString()}`);
    
    if (cerrarModal) {
        setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#151a25] text-primary dark:text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md hover:bg-[#222] hover:text-white"
      >
        <span className="material-symbols-outlined text-[18px]">sort</span>
        <span>Ordenar</span>

        {/* Indicador azul (Punto) */}
        {hasActiveSort && (
            <span className="flex h-2 w-2 rounded-full bg-blue-600 ml-1 animate-in fade-in zoom-in duration-300"></span>
        )}
      </button>

      <OrdenarProveedores 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onAplicar={handleAplicar}
        valorActual={valorActual}
      />
    </>
  );
}