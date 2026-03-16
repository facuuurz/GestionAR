"use client";

import { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/actions/usuarios";
import { useRouter } from "next/navigation";
import { validatePasswordStrength } from "@/lib/passwordUtils";

export default function ChangePasswordForm({ userId }: { userId: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorObj, setErrorObj] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorObj("");
    setSuccessMsg("");

    if (!oldPass || !newPass || !confirmPass) {
      setErrorObj("Todos los campos son obligatorios.");
      return;
    }

    if (newPass !== confirmPass) {
      setErrorObj("Las contraseñas nuevas no coinciden.");
      return;
    }

    const strengthError = validatePasswordStrength(newPass);
    if (strengthError) {
      setErrorObj(strengthError);
      return;
    }

    setIsLoading(true);

    const result = await changePassword(userId, oldPass, newPass);

    if (result.success) {
      setSuccessMsg("¡Contraseña actualizada con éxito! Redirigiendo al login...");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      
      // Wait a bit to let the user read the message, then redirect to login
      setTimeout(() => {
        router.push("/login?message=Contraseña actualizada. Por favor inicia sesión nuevamente.");
      }, 2500);
      
    } else {
      setErrorObj(result.error || "Ocurrió un error.");
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between mt-4 border-t border-gray-100 dark:border-[#333] pt-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
            <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contraseña</p>
            <p className="text-base text-gray-900 dark:text-white">••••••••</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setIsEditing(true);
            setSuccessMsg("");
            setErrorObj("");
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          Modificar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-gray-100 dark:border-[#333] pt-6 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-blue-500" />
        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Cambiar Contraseña</h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Actual</label>
          <div className="relative">
            <input 
              type={showOldPass ? "text" : "password"} 
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
              placeholder="••••••••"
            />
            <button 
              type="button" 
              onClick={() => setShowOldPass(!showOldPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nueva Contraseña</label>
          <div className="relative">
            <input 
              type={showNewPass ? "text" : "password"} 
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
              placeholder="••••••••"
            />
            <button 
              type="button" 
              onClick={() => setShowNewPass(!showNewPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
          <div className="relative">
            <input 
              type={showConfirmPass ? "text" : "password"} 
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
              placeholder="••••••••"
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {errorObj && <p className="text-sm text-red-500 font-medium">{errorObj}</p>}
        {successMsg && <p className="text-sm text-green-500 font-medium">{successMsg}</p>}

        <div className="flex gap-3 pt-2">
          <button 
            type="button" 
            onClick={() => setIsEditing(false)}
            className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
