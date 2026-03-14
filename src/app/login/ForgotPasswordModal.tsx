"use client";

import { useState } from "react";
import { submitRecovery } from "@/lib/recovery";
import { X, Loader2, Info } from "lucide-react";

export default function ForgotPasswordModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [role, setRole] = useState<"ADMIN" | "EMPLEADO" | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !email) return;

    setIsSubmitting(true);
    setResponse(null);

    try {
      const res = await submitRecovery(email, role);
      setResponse(res);
    } catch (error) {
      setResponse({ error: "Ocurrió un error inesperado al procesar la solicitud." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRole(null);
    setEmail("");
    setResponse(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.25)] w-full max-w-md overflow-hidden transform transition-all"
        role="dialog"
      >
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Recuperación de contraseña</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8">
          {response?.success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 mb-4">
                <Info className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-green-600 text-base leading-relaxed">
                {response.message}
              </p>
              <button
                onClick={handleClose}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium transition-colors text-sm"
              >
                Volver al login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ¿Qué tipo de usuario eres?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("ADMIN")}
                    className={`py-3 px-4 rounded-xl border transition-all text-sm font-medium ${
                      role === "ADMIN" 
                        ? "bg-black border-black text-white" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    Administrador
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("EMPLEADO")}
                    className={`py-3 px-4 rounded-xl border transition-all text-sm font-medium ${
                      role === "EMPLEADO" 
                        ? "bg-black border-black text-white" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    Empleado
                  </button>
                </div>
              </div>

              {role && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo asociado ({role.toLowerCase()})
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-sm"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              )}

              {response?.error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-200 py-2 px-3 rounded-lg">{response.error}</p>
              )}

              <button
                type="submit"
                disabled={!role || !email || isSubmitting}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar solicitud"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
