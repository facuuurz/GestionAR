"use client";

import { useActionState, useState } from "react";
import { login } from "@/lib/auth";
import ForgotPasswordModal from "@/app/login/ForgotPasswordModal";
import { Loader2, Lock, User } from "lucide-react";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(login, null as { error?: string } | null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <form action={action} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Usuario</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              name="username"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="Ej: admin123"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              name="password"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        {(state as any)?.error && (
          <div className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-500/20">
            {(state as any).error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-700 rounded bg-gray-800"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
              Recordarme
            </label>
          </div>

          <div className="text-sm">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors cursor-pointer outline-none"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Ingresar"
            )}
          </button>
        </div>
      </form>

      <ForgotPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
