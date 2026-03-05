import { Suspense } from "react";
import Search from "@/components/Proveedores/Search";
import SortProveedoresWrapper from "@/components/Proveedores/SortProveedoresWrapper";

export default function BarraNavegacionProveedores() {
  return (
    <div className="bg-white dark:bg-[#1e2736] p-4 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col md:flex-row items-center gap-4 shrink-0">
      
      <div className="w-full md:flex-1">
        <Suspense fallback={<div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
           <Search placeholder="Buscar por Código, Razón Social o Contacto..." />
        </Suspense>
      </div>

      <div className="flex shrink-0">
         <Suspense fallback={<div className="h-10 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />}>
            <SortProveedoresWrapper />
         </Suspense>
      </div>

    </div>
  );
}