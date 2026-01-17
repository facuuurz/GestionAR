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

  const handleAplicar = (criterio: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (criterio) {
      params.set("sort", criterio);
    } else {
      params.delete("sort");
    }
    
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1e293b] border border-[#e4e4e7] dark:border-[#334155] rounded-lg text-sm font-medium hover:bg-[#f4f4f5] dark:hover:bg-gray-800 transition-colors whitespace-nowrap"
      >
        <span className="material-symbols-outlined text-lg">sort</span>
        Ordenar
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