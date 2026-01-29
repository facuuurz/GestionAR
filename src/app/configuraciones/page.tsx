"use client";

import { useState, useEffect } from "react";

export default function ConfiguracionesPage() {
  // Estado del tema: 'light' o 'dark'
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications, setNotifications] = useState(true);

  // Datos del formulario
  const [nombre, setNombre] = useState("admin_gestionar");
  const [email, setEmail] = useState("contacto@empresa.com");

  // EFECTO: Aplicar la clase 'dark' al HTML cuando cambia el estado
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex-1 min-h-0 bg-[#f0f2f5] dark:bg-[#0a0a0a] p-4 md:px-8 lg:px-12 py-8 overflow-y-auto transition-colors duration-300">
      <div className="mx-auto w-full max-w-[1200px]">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#637588] dark:text-gray-400 text-sm font-medium">Panel</span>
          <span className="text-[#637588] dark:text-gray-500 text-sm">
            <span className="material-symbols-outlined text-[16px] align-middle">chevron_right</span>
          </span>
          <span className="text-[#111418] dark:text-white text-sm font-medium">Configuraciones</span>
        </div>

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-[#111418] dark:text-white text-3xl font-bold tracking-tight mb-2">Configuraciones Generales</h1>
          <p className="text-[#637588] dark:text-gray-400 text-base">Administra tu perfil y las preferencias del sistema.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMNA IZQUIERDA: PERFIL */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#111418] rounded-xl border border-[#e5e7eb] dark:border-[#333] shadow-sm overflow-hidden transition-colors">
              <div className="px-6 py-5 border-b border-[#e5e7eb] dark:border-[#333] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#111418] dark:text-white">person</span>
                <h2 className="text-lg font-bold text-[#111418] dark:text-white">Configuración de Perfil</h2>
              </div>
              
              <div className="p-6 flex flex-col gap-6">
                
                {/* Nombre Usuario */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#111418] dark:text-gray-200">Nombre de Usuario</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="bg-blue-50 dark:bg-blue-900/30 text-[#3b82f6] dark:text-blue-400 p-1 rounded-md">
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </div>
                    </div>
                    <input 
                      className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#333] bg-[#f8fafc] dark:bg-[#1c1c1c] text-[#111418] dark:text-white pl-12 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all" 
                      type="text" 
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#111418] dark:text-gray-200">Email de Contacto</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-1 rounded-md">
                        <span className="material-symbols-outlined text-[18px]">mail</span>
                      </div>
                    </div>
                    <input 
                      className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#333] bg-[#f8fafc] dark:bg-[#1c1c1c] text-[#111418] dark:text-white pl-12 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] transition-all" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Contraseña (Visualmente presente, ignorada funcionalmente) */}
                <div className="pt-4 border-t border-[#e5e7eb] dark:border-[#333] opacity-60 pointer-events-none grayscale">
                  <h3 className="text-base font-bold text-[#111418] dark:text-white mb-4">Cambiar Contraseña (Deshabilitado)</h3>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-[#111418] dark:text-gray-200">Contraseña Actual</label>
                      <input className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#333] bg-[#f8fafc] dark:bg-[#1c1c1c] text-[#111418] dark:text-white px-4 py-2.5 text-sm" placeholder="••••••••" type="password" disabled/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#111418] dark:text-gray-200">Nueva Contraseña</label>
                        <input className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#333] bg-[#f8fafc] dark:bg-[#1c1c1c] text-[#111418] dark:text-white px-4 py-2.5 text-sm" placeholder="••••••••" type="password" disabled/>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-[#111418] dark:text-gray-200">Confirmar Contraseña</label>
                        <input className="w-full rounded-lg border border-[#e5e7eb] dark:border-[#333] bg-[#f8fafc] dark:bg-[#1c1c1c] text-[#111418] dark:text-white px-4 py-2.5 text-sm" placeholder="••••••••" type="password" disabled/>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: PREFERENCIAS */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#111418] rounded-xl border border-[#e5e7eb] dark:border-[#333] shadow-sm overflow-hidden transition-colors">
              <div className="px-6 py-5 border-b border-[#e5e7eb] dark:border-[#333] flex items-center gap-3">
                <span className="material-symbols-outlined text-[#111418] dark:text-white">settings</span>
                <h2 className="text-lg font-bold text-[#111418] dark:text-white">Preferencias del Sistema</h2>
              </div>
              
              <div className="p-6 flex flex-col gap-6">
                
                {/* Notificaciones Toggle */}
                <div className="flex items-center justify-between p-4 bg-[#f8fafc] dark:bg-[#1c1c1c] rounded-lg border border-[#e5e7eb] dark:border-[#333]">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 p-2 rounded-lg">
                      <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-[#111418] dark:text-white">Notificaciones</p>
                      <p className="text-xs text-[#637588] dark:text-gray-400">Alertas de inventario</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#111418] dark:peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Tema (Light / Dark) */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#111418] dark:text-gray-200">Tema de la Interfaz</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Botón Claro */}
                    <label className="cursor-pointer group relative">
                      <input 
                        type="radio" 
                        name="theme" 
                        className="peer sr-only" 
                        checked={theme === 'light'}
                        onChange={() => setTheme('light')}
                      />
                      <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#e5e7eb] dark:border-[#333] bg-white dark:bg-[#1c1c1c] peer-checked:border-[#111418] dark:peer-checked:border-white peer-checked:bg-[#f8fafc] dark:peer-checked:bg-[#252525] peer-checked:ring-1 peer-checked:ring-[#111418] dark:peer-checked:ring-white text-[#637588] dark:text-gray-400 peer-checked:text-[#111418] dark:peer-checked:text-white transition-all hover:bg-[#f8fafc] dark:hover:bg-[#252525]">
                        <span className="material-symbols-outlined mb-1">light_mode</span>
                        <span className="text-xs font-medium">Claro</span>
                      </div>
                      {theme === 'light' && (
                        <div className="absolute top-2 right-2 text-[#111418] dark:text-white">
                          <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                        </div>
                      )}
                    </label>

                    {/* Botón Oscuro */}
                    <label className="cursor-pointer group relative">
                      <input 
                        type="radio" 
                        name="theme" 
                        className="peer sr-only" 
                        checked={theme === 'dark'}
                        onChange={() => setTheme('dark')}
                      />
                      <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-[#e5e7eb] dark:border-[#333] bg-white dark:bg-[#1c1c1c] peer-checked:border-[#111418] dark:peer-checked:border-white peer-checked:bg-[#f8fafc] dark:peer-checked:bg-[#252525] peer-checked:ring-1 peer-checked:ring-[#111418] dark:peer-checked:ring-white text-[#637588] dark:text-gray-400 peer-checked:text-[#111418] dark:peer-checked:text-white transition-all hover:bg-[#f8fafc] dark:hover:bg-[#252525]">
                        <span className="material-symbols-outlined mb-1">dark_mode</span>
                        <span className="text-xs font-medium">Oscuro</span>
                      </div>
                       {theme === 'dark' && (
                        <div className="absolute top-2 right-2 text-[#111418] dark:text-white">
                          <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                        </div>
                      )}
                    </label>

                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Botones de Acción */}
        <div className="flex gap-3 justify-end pt-8 pb-10">
          <button className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-white dark:bg-[#1c1c1c] border border-[#e5e7eb] dark:border-[#333] text-[#111418] dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors shadow-sm">
            <span className="truncate">Cancelar</span>
          </button>
          <button className="flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-[#111418] dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-[#111418]/90 dark:hover:bg-gray-200 transition-all shadow-sm gap-2">
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span className="truncate">Guardar Cambios</span>
          </button>
        </div>

      </div>
    </div>
  );
}