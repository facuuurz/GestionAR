"use client";

interface BarraNavegacionPromocionesProps {
  busqueda: string;
  onSearchChange: (value: string) => void;
}

export default function BarraNavegacionPromociones({
  busqueda,
  onSearchChange,
}: BarraNavegacionPromocionesProps) {
  
  return (
    <div className="bg-white dark:bg-[#1e2736] p-4 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col md:flex-row gap-4 shrink-0">
      
      {/* Input de Búsqueda (Ocupa todo el ancho) */}
      <div className="flex flex-1 items-center bg-[#f5f5f5] dark:bg-[#151a25] rounded-lg px-3 py-2 border border-transparent focus-within:border-primary transition-colors">
        <span className="material-symbols-outlined text-neutral-500">search</span>
        <input 
          className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 text-primary dark:text-white placeholder:text-neutral-500 pl-1" 
          placeholder="Buscar por nombre de promoción o descripción..." 
          type="text" 
          value={busqueda}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
    </div>
  );
}