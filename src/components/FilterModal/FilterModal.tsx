// Ubicación sugerida: /src/components/FilterModal.jsx
"use client";

export default function FilterModal({ isOpen, onClose }) {
  // Si isOpen es falso, no mostramos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Fondo Oscuro (Backdrop) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      ></div>

      {/* Caja del Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <h3 className="text-lg font-bold text-primary dark:text-white">Filtrar Productos</h3>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Cuerpo (Formulario) */}
        <div className="p-6 flex flex-col gap-5">
          
          {/* Filtro: Categoría */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Categoría</label>
            <select className="w-full h-10 px-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-neutral-50 dark:bg-[#252525] text-sm text-primary dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 transition-all cursor-pointer">
              <option>Todas las categorías</option>
              <option>Lácteos</option>
              <option>Bebidas</option>
              <option>Almacén</option>
              <option>Limpieza</option>
            </select>
          </div>

          {/* Filtro: Estado del Stock */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Estado del Stock</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="stock" className="accent-black dark:accent-white cursor-pointer" defaultChecked />
                <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">Todos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="stock" className="accent-black dark:accent-white cursor-pointer" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">Bajo Stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="stock" className="accent-black dark:accent-white cursor-pointer" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-primary transition-colors">Sin Stock</span>
              </label>
            </div>
          </div>

          {/* Filtro: Rango de Precio */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Rango de Precio</label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input type="number" placeholder="Min" className="w-full h-10 pl-6 pr-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#252525] text-sm outline-none focus:border-neutral-400 transition-colors" />
              </div>
              <span className="text-neutral-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input type="number" placeholder="Max" className="w-full h-10 pl-6 pr-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#252525] text-sm outline-none focus:border-neutral-400 transition-colors" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer (Botones) */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-end gap-3">
          
          <button 
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white hover:border-neutral-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
          >
            Cancelar
          </button>

          <button 
            onClick={onClose} 
            className="h-10 px-4 rounded-lg text-sm font-bold bg-neutral-800 text-white hover:bg-black dark:bg-white dark:text-primary dark:hover:bg-neutral-200 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer flex items-center justify-center"
          >
            Aplicar Filtros
          </button>

        </div>
      </div>
    </div>
  );
}