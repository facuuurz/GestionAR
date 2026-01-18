"use client";

import { useActionState } from "react";
import { crearProveedor, State } from "@/actions/proveedores";
import Link from "next/link";

export default function NuevoProveedorPage() {
  const initialState: State = { message: null, errors: {} };
  
  // 1. Obtenemos 'isPending' del hook useActionState
  const [state, formAction, isPending] = useActionState(crearProveedor, initialState);

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      <main className="flex-1 flex flex-col items-center py-8 px-6 lg:px-12 xl:px-40 w-full">
        <div className="flex flex-col w-full max-w-300"> 
          
          {/* --- Breadcrumbs --- */}
          <div className="flex flex-wrap items-center gap-2 px-1 pb-4">
            <Link href="/" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-white transition-colors">
              Panel
            </Link>
            <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
            <Link href="/proveedores" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-white transition-colors">
              Proveedores
            </Link>
            <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
            <span className="text-[#0d121b] dark:text-gray-100 text-sm font-medium">Agregar Proveedor</span>
          </div>

          {/* Título */}
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Agregar Proveedor
            </h1>
            <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
              Complete el formulario a continuación para registrar un nuevo proveedor en el sistema.
            </p>
          </div>

          {/* FORMULARIO */}
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
                
                {/* 1. Código del Proveedor */}
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="codigo">
                    Código del Proveedor <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                    </div>
                    <input 
                      defaultValue={state.payload?.codigo}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900 
                        ${state.errors?.codigo 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'}`}
                      id="codigo" 
                      name="codigo" 
                      placeholder="Ej: PROV-2024" 
                      type="text"
                    />
                  </div>
                  {state.errors?.codigo && (
                    <p className="text-sm text-red-500 mt-1 font-medium ml-1">{state.errors.codigo[0]}</p>
                  )}
                </div>

                {/* 2. Estado */}
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="estado">
                      Estado
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 z-10 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">toggle_on</span>
                    </div>
                    <select 
                        defaultValue={state.payload?.estado || "Activo"} 
                        className="w-full appearance-none rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 border-transparent focus:border-[#135bec] focus:bg-white dark:focus:bg-gray-900 pl-14 pr-10 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:ring-2 focus:ring-[#135bec]/20 cursor-pointer" 
                        id="estado" 
                        name="estado"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#616f89] dark:text-gray-400">
                      <span className="material-symbols-outlined text-[24px]">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* 3. Razón Social */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="razonSocial">
                    Razón Social <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">domain</span>
                    </div>
                    <input 
                      defaultValue={state.payload?.razonSocial}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900
                        ${state.errors?.razonSocial 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'}`}
                      id="razonSocial" 
                      name="razonSocial" 
                      placeholder="Nombre de la empresa o proveedor" 
                      type="text"
                    />
                  </div>
                  {state.errors?.razonSocial && (
                    <p className="text-sm text-red-500 mt-1 font-medium ml-1">{state.errors.razonSocial[0]}</p>
                  )}
                </div>

                {/* 4. Contacto */}
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="contacto">
                    Contacto
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <input 
                      defaultValue={state.payload?.contacto}
                      className="w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 border-transparent focus:border-[#135bec] focus:bg-white dark:focus:bg-gray-900 pl-14 pr-4 py-3 text-[#111318] dark:text-white placeholder-[#616f89] transition-all outline-none ring-0 focus:ring-2 focus:ring-[#135bec]/20" 
                      id="contacto" 
                      name="contacto" 
                      placeholder="Nombre del contacto" 
                      type="text"
                    />
                  </div>
                </div>

                {/* 5. Teléfono */}
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="telefono">
                    Teléfono
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </div>
                    <input 
                      defaultValue={state.payload?.telefono}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900
                        ${state.errors?.telefono 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'}`}
                      id="telefono" 
                      name="telefono" 
                      placeholder="+54 11 1234-5678" 
                      type="tel"
                    />
                  </div>
                  {state.errors?.telefono && (
                    <p className="text-sm text-red-500 mt-1 font-medium ml-1">{state.errors.telefono[0]}</p>
                  )}
                </div>

                {/* 6. Email */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="email">
                    Correo Electrónico
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </div>
                    <input 
                      defaultValue={state.payload?.email}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900
                        ${state.errors?.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'}`}
                      id="email" 
                      name="email" 
                      placeholder="correo@empresa.com" 
                      type="email"
                    />
                  </div>
                  {state.errors?.email && (
                    <p className="text-sm text-red-500 mt-1 font-medium ml-1">{state.errors.email[0]}</p>
                  )}
                </div>

              </div>
            </div>

            {/* --- FOOTER BOTONES ACTUALIZADO --- */}
            <div className="px-6 md:px-8 py-5 bg-[#f8f9fa] dark:bg-gray-800/50 border-t border-[#e5e7eb] dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3">
               
               {/* Botón Cancelar (ANIMADO) */}
               <Link 
                  href="/proveedores" 
                  className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-gray-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-gray-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                  Cancelar
                </Link>
                
                {/* Botón Guardar (ANIMADO) */}
                <button 
                  type="submit" 
                  disabled={isPending}
                  className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
                    ${isPending ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black dark:bg-[#135bec] dark:hover:bg-blue-600'}
                  `}
                >
                  {isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Guardar Proveedor
                    </>
                  )}
                </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}