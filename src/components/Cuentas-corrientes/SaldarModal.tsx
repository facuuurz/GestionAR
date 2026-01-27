"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. Importamos createPortal

interface SaldarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (monto: number) => Promise<void>;
  clienteNombre: string;
  saldoActual: number;
}

export default function SaldarModal({ isOpen, onClose, onConfirm, clienteNombre, saldoActual }: SaldarModalProps) {
  const [monto, setMonto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false); // 2. Estado para controlar el montaje

  // 3. Solo montamos el portal en el cliente (evita errores de hidratación)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setMonto("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Si no está abierto o no estamos en el cliente, no renderizamos nada
  if (!isOpen || !mounted) return null;

  const handleSubmit = async () => {
    if (!monto || isNaN(Number(monto))) return;
    
    setIsSubmitting(true);
    await onConfirm(Number(monto));
    setIsSubmitting(false);
    onClose();
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount);
  };

  // 4. Contenido del modal (lo que ya tenías)
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 text-left">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <h3 className="text-lg font-bold text-primary dark:text-white">Saldar Cuenta</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer hover:scale-110 active:scale-95 duration-200">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Info Cliente */}
          <div className="bg-neutral-50 dark:bg-[#252525] p-4 rounded-xl border border-[#ededed] dark:border-[#333]">
            <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">Cliente</p>
            <p className="text-base font-bold text-neutral-800 dark:text-white mb-3">{clienteNombre}</p>
            <div className="flex justify-between items-center pt-3 border-t border-[#ededed] dark:border-[#333]">
                <span className="text-sm text-neutral-500">Saldo Actual:</span>
                <span className={`text-sm font-bold ${saldoActual < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatMoney(saldoActual)}
                </span>
            </div>
          </div>

          {/* Input Monto */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">attach_money</span>
              Monto a ingresar
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">$</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                autoFocus
                className="w-full h-12 pl-8 pr-4 rounded-xl border-2 border-neutral-200 dark:border-[#333] bg-white dark:bg-[#252525] text-lg font-bold text-neutral-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-neutral-300" 
              />
            </div>
            <p className="text-xs text-neutral-400 ml-1">
                Este monto se sumará al saldo actual de la cuenta.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex flex-col sm:flex-row justify-end gap-3">
            
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-neutral-600 border border-neutral-300 bg-white hover:bg-neutral-50 transition-all hover:scale-105 active:scale-95 cursor-pointer dark:bg-transparent dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-800 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button 
                onClick={handleSubmit} 
                disabled={!monto || isSubmitting}
                className="w-full sm:w-auto h-10 px-6 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:bg-neutral-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                ) : (
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                )}
                Confirmar
            </button>
        </div>
      </div>
    </div>
  );

  // 5. USAMOS EL PORTAL: Renderizamos el contenido en document.body
  return createPortal(modalContent, document.body);
}