"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ToggleProveedorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isToggling: boolean;
  nombreProveedor?: string;
  isActivating: boolean; // true para activar, false para inactivar
}

export default function ToggleProveedorModal({
  isOpen,
  onClose,
  onConfirm,
  isToggling,
  nombreProveedor,
  isActivating,
}: ToggleProveedorModalProps) {
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e2736] w-full max-w-md rounded-2xl shadow-2xl border border-neutral-200 dark:border-[#333] overflow-hidden transform transition-all scale-100">
        
        {/* Cabecera del Modal */}
        <div className="p-6 pb-0 flex flex-col items-center text-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
              isActivating 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
            }`}>
            <span className="material-symbols-outlined text-2xl">
              {isActivating ? 'check_circle' : 'block'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {isActivating ? '¿Activar Proveedor?' : '¿Inactivar Proveedor?'}
          </h3>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">Estás a punto de {isActivating ? 'activar' : 'inactivar'} a <span className="font-bold text-gray-800 dark:text-gray-200">"{nombreProveedor}"</span>.</p>
            
            <div className={`border rounded-lg p-3 text-xs text-left ${
              isActivating 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-300' 
                : 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30 text-orange-700 dark:text-orange-300'
            }`}>
                <p className="font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Información
                </p>
                <p className="mt-1 opacity-90">
                    {isActivating 
                        ? 'El proveedor volverá a estar disponible para ser seleccionado en los formularios de productos.' 
                        : 'El proveedor ya no aparecerá como opción disponible al registrar o editar productos nuevos, pero podrás volver a activarlo más adelante.'}
                </p>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="p-6 grid grid-cols-2 gap-3">
          <button 
            type="button"
            disabled={isToggling}
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button 
            type="button"
            disabled={isToggling}
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-lg text-white font-semibold shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              isActivating 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' 
                : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/30'
            }`}
          >
            {isToggling ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                {isActivating ? 'Activando...' : 'Inactivando...'}
              </>
            ) : (
              isActivating ? "Sí, Activar" : "Sí, Inactivar"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
