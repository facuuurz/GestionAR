"use client";

import { useActionState } from "react";
import Link from "next/link";
import { State } from "@/actions/cuentas-corrientes";

interface EditarClienteFormProps {
  cliente: any; 
  actualizarAction: (prevState: State, formData: FormData) => Promise<State>;
  eliminarAction: () => Promise<void>;
}

export default function EditarClienteForm({ cliente, actualizarAction, eliminarAction }: EditarClienteFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(actualizarAction, initialState);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.")) {
        await eliminarAction();
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm overflow-hidden">
      
      {/* FORMULARIO DE EDICIÓN */}
      <form action={formAction} id="form-editar">
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Nombre / Razón Social</label>
            <div className="relative flex items-center group">
              <div className="absolute left-3 flex items-center justify-center size-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <input 
                required
                name="nombre"
                defaultValue={cliente.nombre}
                className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                type="text"
              />
            </div>
            {state.errors?.nombre && <p className="text-red-500 text-xs">{state.errors.nombre[0]}</p>}
          </div>

          {/* CUIT */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#111318] dark:text-gray-200">CUIT / CUIL</label>
            <div className="relative flex items-center group">
              <div className="absolute left-3 flex items-center justify-center size-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <input 
                name="cuit"
                defaultValue={cliente.cuit || ""}
                className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                type="text"
              />
            </div>
             {state.errors?.cuit && <p className="text-red-500 text-xs">{state.errors.cuit[0]}</p>}
          </div>

          {/* Dirección */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Dirección</label>
            <div className="relative flex items-center group">
              <div className="absolute left-3 flex items-center justify-center size-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
              <input 
                name="direccion"
                defaultValue={cliente.direccion || ""}
                className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                type="text"
              />
            </div>
             {state.errors?.direccion && <p className="text-red-500 text-xs">{state.errors.direccion[0]}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Ciudad</label>
            <div className="relative flex items-center group">
              <div className="absolute left-3 flex items-center justify-center size-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                <span className="material-symbols-outlined text-[18px]">map</span>
              </div>
              <input 
                name="ciudad"
                defaultValue={cliente.ciudad || ""}
                placeholder="Ej: Paraná"
                className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                type="text"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Teléfono</label>
            <div className="relative flex items-center group">
              <div className="absolute left-3 flex items-center justify-center size-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </div>
              <input 
                name="telefono"
                defaultValue={cliente.telefono || ""}
                className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                type="tel"
              />
            </div>
             {state.errors?.telefono && <p className="text-red-500 text-xs">{state.errors.telefono[0]}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Email</label>
            <div className="relative flex items-center group">
              <div className="absolute left-3 flex items-center justify-center size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </div>
              <input 
                name="email"
                defaultValue={cliente.email || ""}
                className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                type="email"
              />
            </div>
             {state.errors?.email && <p className="text-red-500 text-xs">{state.errors.email[0]}</p>}
          </div>

          {/* SALDO */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Saldo</label>
            <div className="relative flex items-center group">
              <div className="absolute left-3 flex items-center justify-center size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                <span className="material-symbols-outlined text-[18px]">attach_money</span>
              </div>
              <input 
                name="saldo"
                defaultValue={cliente.saldo?.toString() || "0"}
                className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-mono" 
                type="number"
                step="0.01"
              />
            </div>
             {state.errors?.saldo && <p className="text-red-500 text-xs">{state.errors.saldo[0]}</p>}
            
            {/* ICONO WARNING */}
            <div className="text-xs text-[#616f89] dark:text-gray-400 mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-500 fill-1">warning</span>
                <span>Modificar esto altera la deuda.</span>
            </div>

          </div>

        </div>

        {/* FOOTER BAR */}
        <div className="bg-[#f9fafb] dark:bg-gray-800/50 px-6 py-4 md:px-8 border-t border-[#f0f2f4] dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <button
            type="button" 
            onClick={handleDelete}
            className="w-full md:w-auto h-10 px-4 rounded-lg bg-red-600 text-white font-bold text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Eliminar Cliente
          </button>

          <div className="flex flex-col-reverse md:flex-row gap-4 w-full md:w-auto">
            <Link
              href="/cuentas-corrientes"
              className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={isPending}
              className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
              ${isPending ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200'}`}
            >
              {isPending ? (
                  <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      Guardando...
                  </>
              ) : (
                  <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Guardar Cambios
                  </>
              )}
            </button>
          </div>
          
        </div>
      </form>
    </div>
  );
}