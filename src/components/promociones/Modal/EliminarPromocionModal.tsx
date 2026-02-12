"use client";

interface EliminarPromocionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
  nombrePromocion?: string;
}

export default function EliminarPromocionModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  nombrePromocion,
}: EliminarPromocionModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e2736] w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#333] overflow-hidden transform transition-all scale-100">
        
        {/* Cabecera del Modal */}
        <div className="p-6 pb-0 flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">¿Eliminar Promoción?</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Estás a punto de eliminar <span className="font-bold text-gray-800 dark:text-gray-200">"{nombrePromocion}"</span>. 
            Esta acción no se puede deshacer.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="p-6 grid grid-cols-2 gap-3">
          <button 
            disabled={isDeleting}
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button 
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