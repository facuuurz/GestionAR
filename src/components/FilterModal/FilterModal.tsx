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
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-700 dark:text-white">filter_list</span>
            <h3 className="text-lg font-bold text-primary dark:text-white">Filtrar Productos</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Cuerpo (Formulario) */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Filtro: Categoría */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">category</span>
              Categoría
            </label>
            {/* SELECT MEJORADO: Más visible, bordes más definidos */}
            <div className="relative">
              <select className="w-full h-11 px-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#2a2a2a] text-sm text-neutral-800 dark:text-white font-medium focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 dark:focus:ring-white/5 transition-all cursor-pointer appearance-none">
                <option>Todas las categorías</option>
                <option>Lácteos</option>
                <option>Bebidas</option>
                <option>Almacén</option>
                <option>Limpieza</option>
              </select>
              {/* Icono de flecha personalizado para el select */}
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Filtro: Estado del Stock */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">inventory_2</span>
              Estado del Stock
            </label>
            <div className="flex flex-wrap gap-2">
              {/* Radio Button: Todos */}
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-[#252525] cursor-pointer transition-colors flex-1 justify-center">
                <input type="radio" name="stock" className="accent-black dark:accent-white cursor-pointer" defaultChecked />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Todos</span>
              </label>
              {/* Radio Button: Bajo Stock */}
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-[#252525] cursor-pointer transition-colors flex-1 justify-center">
                <input type="radio" name="stock" className="accent-black dark:accent-white cursor-pointer" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">Bajo</span>
              </label>
              {/* Radio Button: Sin Stock */}
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-[#252525] cursor-pointer transition-colors flex-1 justify-center">
                <input type="radio" name="stock" className="accent-black dark:accent-white cursor-pointer" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">Sin Stock</span>
              </label>
            </div>
          </div>

          {/* Filtro: Rango de Precio */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">payments</span>
              Rango de Precio
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input type="number" placeholder="Min" className="w-full h-10 pl-6 pr-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#252525] text-sm text-neutral-900 dark:text-white outline-none focus:border-neutral-400 transition-colors" />
              </div>
              <span className="text-neutral-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input type="number" placeholder="Max" className="w-full h-10 pl-6 pr-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#252525] text-sm text-neutral-900 dark:text-white outline-none focus:border-neutral-400 transition-colors" />
              </div>
            </div>
          </div>

        </div>

        {/* Footer (Botones) */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-end gap-3">
          
          <button 
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2"
          >
            Cancelar
          </button>

          <button 
            onClick={onClose} 
            className="h-10 px-4 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer flex items-center gap-2 dark:bg-white dark:text-black"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            Aplicar Filtros
          </button>

        </div>
      </div>
    </div>
  );
}