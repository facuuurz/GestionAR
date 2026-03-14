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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
        role="dialog"
      >
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Recuperación de contraseña</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {response?.success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mb-4">
                <Info className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-lg leading-relaxed">
                {response.message}
              </p>
              <button
                onClick={handleClose}
                className="mt-6 w-full py-2 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors border border-gray-700"
              >
                Volver al login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  ¿Qué tipo de usuario eres?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("ADMIN")}
                    className={`py-3 px-4 rounded-xl border transition-all text-sm font-medium ${
                      role === "ADMIN" 
                        ? "bg-blue-500/20 border-blue-500 text-blue-400" 
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    Administrador
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("EMPLEADO")}
                    className={`py-3 px-4 rounded-xl border transition-all text-sm font-medium ${
                      role === "EMPLEADO" 
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" 
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    Empleado
                  </button>
                </div>
              </div>

              {role && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Correo asociado ({role.toLowerCase()})
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              )}

              {response?.error && (
                <p className="text-red-400 text-sm mt-2">{response.error}</p>
              )}

              <button
                type="submit"
                disabled={!role || !email || isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
