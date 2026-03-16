"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun, Settings } from "lucide-react";

export default function ConfiguracionesPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect solo ejecuta esto en el cliente, evitamos errores de SSR
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col max-w-4xl flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500 gap-8">
        
        {/* Cabecera */}
        <div className="flex flex-col gap-2">
          <h1 className="text-primary dark:text-white text-3xl sm:text-4xl font-bold leading-tight flex items-center gap-3">
            <Settings className="w-8 h-8 md:w-10 md:h-10 text-gray-700 dark:text-gray-300" />
            Configuraciones
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg">
            Ajusta las preferencias generales del sistema a tu gusto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Apariencia / Tema */}
          <div className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Apariencia</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Elige cómo quieres que se vea la interfaz. El modo oscuro te ayuda a descansar la vista.
            </p>

            <div className="flex flex-col gap-4">
              
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${theme === "light" ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <div className={`p-2 rounded-lg ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Claro</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Aspecto luminoso, clásico.</p>
                </div>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${theme === "dark" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-indigo-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                  <Moon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Oscuro</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Aspecto de bajo contraste.</p>
                </div>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${theme === "system" ? "border-green-500 bg-green-50 dark:bg-green-500/10" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`}
              >
                <div className={`p-2 rounded-lg ${theme === "system" ? "bg-green-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Sistema</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sincroniza con tu sistema operativo.</p>
                </div>
              </button>
              
            </div>
          </div>

          {/* Más ajustes placeholder para un futuro */}
          <div className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 shadow-sm opacity-60">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Otros ajustes</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Próximamente agregaremos más configuraciones aquí, como alertas por correo o límites de stock.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
