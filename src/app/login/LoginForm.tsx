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
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1" htmlFor="username">
            Usuario
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200"
              placeholder="admin123"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1" htmlFor="password">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200"
              placeholder="••••••••"
            />
          </div>
        </div>

        {(state as any)?.error && (
          <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg border border-red-200">
            {(state as any).error}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <label htmlFor="remember-me" className="ml-2 block text-xs md:text-sm text-gray-600">
              Recordarme
            </label>
          </div>

          <div className="text-xs md:text-sm">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="font-medium text-gray-600 hover:text-black transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </div>
      </form>

      <ForgotPasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
