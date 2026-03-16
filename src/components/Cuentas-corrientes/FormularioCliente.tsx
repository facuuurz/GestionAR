"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { State } from "@/actions/cuentas-corrientes";

interface FormularioClienteProps {
  actionFunc: (prevState: State, formData: FormData) => Promise<State>;
  initialData?: any;
}

export default function FormularioCliente({ actionFunc, initialData }: FormularioClienteProps) {
  const router = useRouter();
  const [mostrarExito, setMostrarExito] = useState(false);
  const initialState: State = { message: null, errors: {}, payload: initialData };
  const [state, formAction, isPending] = useActionState(actionFunc, initialState);

  useEffect(() => {
    if (state.success) {
      setMostrarExito(true);
      setTimeout(() => {
        router.push("/cuentas-corrientes");
      }, 2500);
    }
  }, [state.success, router]);

  return (
    <>
      <form action={formAction} className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden">
      
      {/* Cabecera del Formulario */}
      <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-600 flex items-center gap-3">
        <span className="material-symbols-outlined text-slate-900 dark:text-white">account_box</span>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Información del Cliente</h2>
      </div>

      <div className="p-8 space-y-8">
        
        {/* Mensaje de error general si falla la base de datos o hay cuit duplicado */}
        {state.message && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">error</span>
                {state.message}
            </div>
        )}

        {/* FILA 1: Nombre y CUIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Campo: Nombre / Razón Social */}
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
              Nombre o Razón Social <span className="text-slate-900 dark:text-slate-200">*</span>
            </label>
            <div className="relative flex items-center">
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

        {/* FILA 3: Dirección y Ciudad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Campo: Dirección */}
          <div className="space-y-2">
            <label htmlFor="direccion" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
              Dirección Física
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined text-sm">location_on</span>
              </div>
              <input 
                name="direccion"
                id="direccion"
                type="text" 
                defaultValue={state.payload?.direccion}
                placeholder="Calle 123" 
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

          {/* Campo: Ciudad */}
          <div className="space-y-2">
            <label htmlFor="ciudad" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
              Ciudad / Localidad
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-2 w-8 h-8 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                <span className="material-symbols-outlined text-sm">map</span>
              </div>
              <input 
                name="ciudad"
                id="ciudad"
                type="text" 
                defaultValue={state.payload?.ciudad}
                placeholder="Ej. Paraná" 
                className={`w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none transition-all placeholder:text-slate-400
                  ${state.errors?.ciudad 
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
                      : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500'}`}
              />
            </div>
          </div>

        </div>

        {/* FILA 4: Saldo Inicial */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="saldo" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
              Saldo Inicial
            </label>
            <div className="relative flex items-center">
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
          
          <Link 
            href="/cuentas-corrientes" 
            className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
          >
            Cancelar
          </Link>
          
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
    
      <div className={`fixed bottom-6 left-6 z-[100] transform transition-all duration-500 ease-in-out ${mostrarExito ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-500">
          <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-xl">check</span>
          </div>
          <div>
            <p className="font-bold text-sm">¡Éxito!</p>
            <p className="text-xs text-green-100">{state.message || "La cuenta se guardó correctamente."}</p>
          </div>
        </div>
      </div>
    </>
  );
}