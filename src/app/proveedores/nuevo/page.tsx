"use client"; // 1. Obligatorio para manejar errores

import { useActionState } from "react"; // 2. El hook mágico
import { crearProveedor, State } from "@/actions/proveedores";
import Link from "next/link";

export default function NuevoProveedorPage() {
  // 3. Configuración del estado inicial
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(crearProveedor, initialState);

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      <main className="flex-1 flex flex-col items-center py-8 px-6 lg:px-12 xl:px-40 w-full">
        <div className="flex flex-col w-full max-w-[1200px]">
          
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap gap-2 pb-4">
            <Link className="text-[#616f89] dark:text-gray-400 text-sm font-medium hover:text-[#135bec] transition-colors" href="/">Panel</Link>
            <span className="text-[#616f89] dark:text-gray-400 text-sm font-medium">&gt;</span>
            <Link className="text-[#616f89] dark:text-gray-400 text-sm font-medium hover:text-[#135bec] transition-colors" href="/proveedores">Proveedores</Link>
            <span className="text-[#616f89] dark:text-gray-400 text-sm font-medium">&gt;</span>
            <span className="text-[#111318] dark:text-gray-100 text-sm font-medium">Agregar Proveedor</span>
          </nav>

          {/* Título */}
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Agregar Proveedor
            </h1>
            <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
              Complete el formulario para registrar una nueva empresa. El código se generará automáticamente.
            </p>
          </div>

          {/* FORMULARIO CONECTADO */}
          <form action={formAction} className="bg-white dark:bg-[#1A202C] rounded-xl border border-[#e5e7eb] dark:border-gray-700 shadow-sm overflow-hidden">
            
            <div className="p-6 md:p-8">
              
              {/* Mensaje Global de Error */}
              {state.message && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    {state.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* NOTA: Eliminé "Código" y "Estado" porque el backend los crea solos */}

                {/* Razón Social */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="razonSocial">
                    Razón Social <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">domain</span>
                    </div>
                    <input 
                      // 4. Conectamos defaultValue para que no se borre al haber error
                      defaultValue={state.payload?.razonSocial}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 
                        ${state.errors?.razonSocial ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#135bec]'}`}
                      id="razonSocial" 
                      name="razonSocial" // Importante: debe coincidir con el schema Zod
                      placeholder="Nombre de la empresa o proveedor" 
                      type="text"
                    />
                  </div>
                  {/* 5. Mensaje de error específico */}
                  {state.errors?.razonSocial && (
                    <p className="text-sm text-red-500 mt-1 font-medium ml-1">{state.errors.razonSocial[0]}</p>
                  )}
                </div>

                {/* Contacto */}
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="contacto">Contacto</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <input 
                      defaultValue={state.payload?.contacto}
                      className="w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 border-transparent focus:border-[#135bec] focus:bg-white dark:focus:bg-gray-900 pl-14 pr-4 py-3 text-[#111318] dark:text-white placeholder-[#616f89] transition-all outline-none ring-0" 
                      id="contacto" name="contacto" placeholder="Nombre del contacto" type="text"
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="telefono">Teléfono</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </div>
                    <input 
                      defaultValue={state.payload?.telefono}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 
                        ${state.errors?.telefono ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#135bec]'}`} 
                      id="telefono" name="telefono" placeholder="+54 11 1234-5678" type="tel"
                    />
                  </div>
                  {state.errors?.telefono && (
                    <p className="text-sm text-red-500 mt-1 font-medium ml-1">
                        {state.errors.telefono[0]}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="email">Correo Electrónico</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </div>
                    <input 
                      defaultValue={state.payload?.email}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 
                        ${state.errors?.email ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#135bec]'}`}
                      id="email" name="email" placeholder="correo@empresa.com" type="email"
                    />
                  </div>
                  {state.errors?.email && (
                    <p className="text-sm text-red-500 mt-1 font-medium ml-1">{state.errors.email[0]}</p>
                  )}
                </div>

              </div>
            </div>

            {/* FOOTER BOTONES */}
            <div className="px-6 md:px-8 py-5 bg-[#f8f9fa] dark:bg-gray-800/50 border-t border-[#e5e7eb] dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <Link 
                href="/proveedores"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg border border-[#e5e7eb] dark:border-gray-600 text-[#111318] dark:text-gray-200 bg-white dark:bg-gray-700 font-bold text-sm hover:bg-[#f0f2f4] dark:hover:bg-gray-600 transition-colors text-center"
              >
                Cancelar
              </Link>
              <button 
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-black dark:bg-[#135bec] text-white font-bold text-sm shadow-md hover:bg-gray-800 dark:hover:bg-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Guardar Proveedor</span>
              </button>
            </div>
          </form>

        </div>
      </main>
    </div>
  );
}