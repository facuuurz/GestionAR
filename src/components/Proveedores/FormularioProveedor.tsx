"use client";

import { useActionState } from "react";
import Link from "next/link";
// Recibimos la función de acción (crear o editar) como prop
import { State } from "@/actions/proveedores";

// --- COMPONENTE PARA EL MENSAJE DE ERROR CON ÍCONO ---
function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
      <span className="material-symbols-outlined text-[16px]">error</span>
      {errors[0]}
    </p>
  );
}

// Props para que el formulario sirva tanto para Crear como para Editar
interface FormularioProveedorProps {
  actionFunc: (prevState: State, formData: FormData) => Promise<State>;
  initialData?: any; // Datos iniciales si estamos editando
}

export default function FormularioProveedor({ actionFunc, initialData }: FormularioProveedorProps) {
  const initialState: State = { message: null, errors: {}, payload: initialData };
  const [state, formAction, isPending] = useActionState(actionFunc, initialState);

  return (
    <form action={formAction} className="bg-white dark:bg-[#1A202C] rounded-xl border border-[#e5e7eb] dark:border-gray-700 shadow-sm overflow-hidden">
      
      {/* Header Formulario */}
      <div className="border-b border-[#e5e7eb] dark:border-[#2d3748] px-6 py-4 bg-gray-50/50 dark:bg-[#1e2736]">
        <h3 className="text-base font-bold text-[#0d121b] dark:text-white flex items-center gap-2">
          <span className="material-symbols-outlined">local_shipping</span>
          Información General
        </h3>
      </div>

      <div className="p-6 md:p-8">
        {/* Mensaje Global de Error */}
        {state.message && !Object.keys(state.errors || {}).length && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {state.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Si estamos editando, enviamos el ID oculto */}
          {initialData?.id && (
            <input type="hidden" name="id" value={initialData.id} />
          )}

          {/* 1. Código */}
          <div className="col-span-1 md:col-span-6">
            <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="codigo">
              Código <span className="text-black dark:text-white">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <input 
                defaultValue={state.payload?.codigo}
                className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900 ${state.errors?.codigo ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'}`}
                id="codigo" name="codigo" placeholder="Ej: PROV-2024" type="text"
              />
            </div>
            <ErrorMessage errors={state.errors?.codigo} />
          </div>

          {/* 2. Razón Social */}
          <div className="col-span-1 md:col-span-6">
            <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="razonSocial">
              Razón Social <span className="text-black dark:text-white">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">domain</span>
              </div>
              <input 
                defaultValue={state.payload?.razonSocial}
                className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900 ${state.errors?.razonSocial ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'}`}
                id="razonSocial" name="razonSocial" placeholder="Nombre de la empresa" type="text"
              />
            </div>
            <ErrorMessage errors={state.errors?.razonSocial} />
          </div>

          {/* 3. Contacto */}
          <div className="col-span-1 md:col-span-6">
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
                id="contacto" name="contacto" placeholder="Nombre del contacto" type="text"
              />
            </div>
            <ErrorMessage errors={state.errors?.contacto} />
          </div>

          {/* 4. Teléfono */}
          <div className="col-span-1 md:col-span-6">
            <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="telefono">
              Teléfono <span className="text-black dark:text-white">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </div>
              <input 
                defaultValue={state.payload?.telefono}
                className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900 ${state.errors?.telefono ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'}`}
                id="telefono" name="telefono" placeholder="+54 11 1234-5678" type="tel"
              />
            </div>
            <ErrorMessage errors={state.errors?.telefono} />
          </div>

          {/* 5. Email */}
          <div className="col-span-1 md:col-span-12">
            <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 pointer-events-none">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </div>
              <input 
                defaultValue={state.payload?.email}
                className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900 ${state.errors?.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'}`}
                id="email" name="email" placeholder="correo@empresa.com" type="email"
              />
            </div>
            <ErrorMessage errors={state.errors?.email} />
          </div>

        </div>
      </div>

      {/* Footer Botones */}
      <div className="px-6 md:px-8 py-5 bg-[#f8f9fa] dark:bg-gray-800/50 border-t border-[#e5e7eb] dark:border-gray-700 flex flex-col-reverse sm:flex-row justify-end gap-3">
        <Link 
          href="/proveedores" 
          className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-gray-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-gray-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm"
        >
          Cancelar
        </Link>
        <button 
          type="submit" 
          disabled={isPending}
          className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-sm
            ${isPending ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black dark:bg-[#135bec] dark:hover:bg-blue-600'}
          `}
        >
          {isPending ? (
            <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>Guardando...</>
          ) : (
            <><span className="material-symbols-outlined text-[18px]">save</span>Guardar Proveedor</>
          )}
        </button>
      </div>
    </form>
  );
}