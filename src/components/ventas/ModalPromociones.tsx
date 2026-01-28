type ProductoInfo = {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
};

type PromoItem = {
  cantidad: number;
  producto: ProductoInfo;
};

// Ajusta esto a tu modelo real si tienes campos extra como 'descuento'
type Promocion = {
  id: number;
  nombre: string;
  descripcion: string | null;
  items: PromoItem[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  promociones: Promocion[];
  onSelect: (promo: Promocion) => void;
}

export default function ModalPromociones({ isOpen, onClose, promociones, onSelect }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#1e2736] rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        
        {/* Encabezado */}
        <div className="p-4 border-b border-[#ededed] dark:border-[#333] flex justify-between items-center bg-[#f9f9f9] dark:bg-[#151a25]">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">local_offer</span>
            Seleccionar Promoción
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-red-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Lista de Promos */}
        <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {promociones.length === 0 ? (
            <p className="text-center text-neutral-500 py-10">No hay promociones activas.</p>
          ) : (
            promociones.map((promo) => (
              <div 
                key={promo.id} 
                onClick={() => onSelect(promo)}
                className="group cursor-pointer border border-[#ededed] dark:border-[#333] rounded-lg p-4 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all bg-white dark:bg-[#151a25]"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-indigo-500 transition-colors">
                    {promo.nombre}
                  </h3>
                  <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs px-2 py-1 rounded font-bold">
                    {promo.items.length} Productos
                  </span>
                </div>
                
                {promo.descripcion && (
                  <p className="text-sm text-neutral-500 mb-3">{promo.descripcion}</p>
                )}

                {/* Resumen de productos que incluye */}
                <div className="text-xs text-neutral-600 dark:text-neutral-400 bg-[#f9f9f9] dark:bg-[#101622] p-2 rounded">
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {promo.items.map((item, idx) => (
                      <li key={idx} className="flex gap-1">
                        <span className="font-bold">{item.cantidad}x</span> 
                        <span className="truncate">{item.producto.nombre}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}