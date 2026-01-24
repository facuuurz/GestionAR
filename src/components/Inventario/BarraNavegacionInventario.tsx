"use client";

interface BarraNavegacionInventario {
  // Búsqueda
  busqueda: string;
  onSearchChange: (value: string) => void;
  
  // Filtros
  onOpenFilters: () => void;
  hasActiveFilters: boolean; // Booleano para saber si mostramos el punto azul
  
  // Orden
  onOpenSort: () => void;
  hasActiveSort: boolean;    // Booleano para saber si mostramos el punto azul
}

export default function BarraNavegacion({
  busqueda,
  onSearchChange,
  onOpenFilters,
  hasActiveFilters,
  onOpenSort,
  hasActiveSort
}: BarraNavegacionInventario) {
  
  return (
    <div className="bg-white dark:bg-[#1e2736] p-4 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col md:flex-row gap-4 shrink-0">
      
      {/* Input de Búsqueda */}
      <div className="flex flex-1 items-center bg-[#f5f5f5] dark:bg-[#151a25] rounded-lg px-3 py-2 border border-transparent focus-within:border-primary transition-colors">
        <span className="material-symbols-outlined text-neutral-500">search</span>
        <input 
          className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 text-primary dark:text-white placeholder:text-neutral-500 pl-1" 
          placeholder="Buscar por nombre, código, proveedor..." 
          type="text" 
          value={busqueda}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      {/* Botones de Acción */}
      <div className="flex gap-3 overflow-x-auto p-1"> 
        
        {/* BOTÓN FILTRAR */}
        <button 
          onClick={onOpenFilters} 
          className="group flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#151a25] text-primary dark:text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md hover:bg-[#222] hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          <span>Filtrar</span>
          
          {/* Indicador azul */}
          {hasActiveFilters && (
            <span className="flex h-2 w-2 rounded-full bg-blue-600 ml-1 animate-in fade-in zoom-in duration-300"></span>
          )}
        </button>

        {/* BOTÓN ORDENAR */}
        <button 
          onClick={onOpenSort} 
          className="group flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#151a25] text-primary dark:text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md hover:bg-[#222] hover:text-white"
        >
          <span className="material-symbols-outlined text-[18px]">sort</span>
          <span>Ordenar</span>
          
          {/* Indicador azul */}
          {hasActiveSort && (
            <span className="flex h-2 w-2 rounded-full bg-blue-600 ml-1 animate-in fade-in zoom-in duration-300"></span>
          )}
        </button>
      </div>
    </div>
  );
}