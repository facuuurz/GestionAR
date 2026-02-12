"use client";

interface EliminarProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  nombreProveedor?: string;
}

export default function EliminarProveedorModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  nombreProveedor,
}: EliminarProveedorModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e2736] w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#333] overflow-hidden transform transition-all scale-100">
        
        {/* Cabecera del Modal */}
        <div className="p-6 pb-0 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">¿Eliminar Proveedor?</h3>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Estás a punto de eliminar a <span className="font-bold text-gray-800 dark:text-gray-200">"{nombreProveedor}"</span>.</p>
            
            {/* Alerta de impacto */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-3 text-red-600 dark:text-red-300 text-xs text-left">
                <p className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">dangerous</span>
                    Acción Irreversible
                </p>
                <p className="mt-1 opacity-90">
                    Esto eliminará al proveedor y <b>todos los productos asociados</b> a él de forma permanente.
                </p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="p-6 grid grid-cols-2 gap-3">
          <button 
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button 
            type="button"
            disabled={isDeleting}
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                Eliminando...
              </>
            ) : (
              "Sí, Eliminar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}