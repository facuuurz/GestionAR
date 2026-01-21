"use client";

import { useActionState } from "react"; 
import { crearCliente, State } from "@/actions/cuentas-corrientes";
import Link from "next/link";

export default function NuevoClientePage() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(crearCliente, initialState);

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6] dark:bg-[#111827] text-slate-800 dark:text-slate-100 font-sans">

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl">
          
          {/* Breadcrumbs */}
          {/* Breadcrumbs */}
          <nav className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
            <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">Panel</Link>
            <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
            <Link href="/cuentas-corrientes" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">Cuentas Corrientes</Link>
            <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
            {/* AQUÍ SE CAMBIÓ text-primary POR text-black */}
            <p className="text-black dark:text-white font-bold">Agregar Cuenta</p>
          </nav>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Agregar Nueva Cuenta</h1>
            <p className="text-slate-500 dark:text-slate-400">Ingrese los detalles del nuevo cliente para abrir una cuenta corriente.</p>
          </div>

          {/* FORMULARIO */}
          <form action={formAction} className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden">
            
            {/* Cabecera del Formulario */}
            <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-600 flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-900 dark:text-white">account_box</span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Información del Cliente</h2>
            </div>

            <div className="p-8 space-y-8">
              
              {/* FILA 1: Nombre y CUIT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Campo: Nombre / Razón Social */}
                <div className="space-y-2">
                  <label htmlFor="nombre" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Nombre o Razón Social <span className="text-slate-900 dark:text-slate-200">*</span>
                  </label>
                  <div className="relative flex items-center">
                    {/* CAMBIO: rounded-lg -> rounded-full */}
                    <div className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                      <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                    <input 
                      name="nombre" 
                      id="nombre"
                      type="text" 
                      defaultValue={state.payload?.nombre}
                      placeholder="Ej. Juan Pérez o Pérez S.A." 
                      className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none transition-all placeholder:text-slate-400
                        ${state.errors?.nombre 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'}`}
                    />
                  </div>
                  {state.errors?.nombre && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-500">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <p className="text-sm font-medium">{state.errors.nombre[0]}</p>
                    </div>
                  )}
                </div>

                {/* Campo: CUIT */}
                <div className="space-y-2">
                  <label htmlFor="cuit" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    CUIT / CUIL <span className="text-slate-900 dark:text-slate-200">*</span>
                  </label>
                  <div className="relative flex items-center">
                    {/* CAMBIO: rounded-lg -> rounded-full */}
                    <div className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">
                      <span className="material-symbols-outlined text-sm">id_card</span>
                    </div>
                    <input 
                      name="cuit" 
                      id="cuit"
                      type="text" 
                      defaultValue={state.payload?.cuit}
                      placeholder="Ej. 20-12345678-9" 
                      className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none transition-all placeholder:text-slate-400
                        ${state.errors?.cuit 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500'}`}
                    />
                  </div>
                  {state.errors?.cuit && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-500">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <p className="text-sm font-medium">{state.errors.cuit[0]}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* FILA 2: Email y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                 {/* Campo: Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Correo Electrónico <span className="text-slate-900 dark:text-slate-200">*</span>
                  </label>
                  <div className="relative flex items-center">
                    {/* CAMBIO: rounded-lg -> rounded-full */}
                    <div className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400">
                      <span className="material-symbols-outlined text-sm">mail</span>
                    </div>
                    <input 
                      name="email"
                      id="email" 
                      type="email" 
                      defaultValue={state.payload?.email}
                      placeholder="cliente@ejemplo.com" 
                      className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none transition-all placeholder:text-slate-400
                        ${state.errors?.email 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500'}`}
                    />
                  </div>
                  {state.errors?.email && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-500">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <p className="text-sm font-medium">{state.errors.email[0]}</p>
                    </div>
                  )}
                </div>

                {/* Campo: Teléfono */}
                <div className="space-y-2">
                  <label htmlFor="telefono" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Teléfono <span className="text-slate-900 dark:text-slate-200">*</span>
                  </label>
                  <div className="relative flex items-center">
                    {/* CAMBIO: rounded-lg -> rounded-full */}
                    <div className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                      <span className="material-symbols-outlined text-sm">call</span>
                    </div>
                    <input 
                      name="telefono"
                      id="telefono" 
                      type="tel" 
                      defaultValue={state.payload?.telefono}
                      placeholder="+54 11 1234 5678" 
                      className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none transition-all placeholder:text-slate-400
                        ${state.errors?.telefono 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'}`}
                    />
                  </div>
                   {state.errors?.telefono && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-500">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <p className="text-sm font-medium">{state.errors.telefono[0]}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b border-slate-200 dark:border-slate-600"></div>

              {/* FILA 3: Dirección y Saldo Inicial */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Campo: Dirección (Sin asterisco) */}
                <div className="space-y-2">
                  <label htmlFor="direccion" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Dirección Física
                  </label>
                  <div className="relative flex items-center">
                    {/* CAMBIO: rounded-lg -> rounded-full */}
                    <div className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                    </div>
                    <input 
                      name="direccion"
                      id="direccion"
                      type="text" 
                      defaultValue={state.payload?.direccion}
                      placeholder="Calle Falsa 123, Ciudad" 
                      className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none transition-all placeholder:text-slate-400
                        ${state.errors?.direccion 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                    />
                  </div>
                  {state.errors?.direccion && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-500">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <p className="text-sm font-medium">{state.errors.direccion[0]}</p>
                    </div>
                  )}
                </div>

                {/* Campo: Saldo Inicial (Sin asterisco, Opcional) */}
                <div className="space-y-2">
                  <label htmlFor="saldo" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Saldo Inicial
                  </label>
                  <div className="relative flex items-center">
                    {/* CAMBIO: rounded-lg -> rounded-full */}
                    <div className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-sm">attach_money</span>
                    </div>
                    <input 
                      name="saldo"
                      id="saldo"
                      type="number"
                      step="0.01" 
                      defaultValue={state.payload?.saldo}
                      placeholder="0.00 (Ej: 1500 o -500)" 
                      className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none transition-all placeholder:text-slate-400
                        ${state.errors?.saldo
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500'}`}
                    />
                  </div>
                  {state.errors?.saldo && (
                    <div className="flex items-center gap-1.5 mt-1 text-red-500">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        <p className="text-sm font-medium">{state.errors.saldo[0]}</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* ZONA DE BOTONES */}
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-600 flex flex-col md:flex-row justify-end gap-3">
               
               {/* Botón Cancelar */}
               <Link 
                  href="/cuentas-corrientes" 
                  className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                  Cancelar
                </Link>
                
                {/* Botón Guardar */}
                <button 
                  type="submit" 
                  disabled={isPending}
                  className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
                    ${isPending ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white'}
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
                      Guardar Cuenta
                    </>
                  )}
                </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}