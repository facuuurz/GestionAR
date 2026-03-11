"use client";

import { useActionState } from "react";
import Link from "next/link";
import { State } from "@/actions/proveedores";

// Importamos nuestros componentes UI atómicos
import InputConIcono from "@/components/Proveedores/ui/InputConIcono";
import BotonAccion from "@/components/Proveedores/ui/BotonAccion";

interface FormularioProveedorProps {
  actionFunc: (prevState: State, formData: FormData) => Promise<State>;
  initialData?: any;
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
          
          {initialData?.id && (
            <input type="hidden" name="id" value={initialData.id} />
          )}

          {/* 1. Código */}
          <InputConIcono
            className="col-span-1 md:col-span-6"
            label="Código"
            name="codigo"
            iconName="badge"
            iconColorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            placeholder="Ej: PROV-2024"
            defaultValue={state.payload?.codigo}
            errors={state.errors?.codigo}
            requiredMark
          />

          {/* 2. Razón Social */}
          <InputConIcono
            className="col-span-1 md:col-span-6"
            label="Razón Social"
            name="razonSocial"
            iconName="domain"
            iconColorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            placeholder="Nombre de la empresa"
            defaultValue={state.payload?.razonSocial}
            errors={state.errors?.razonSocial}
            requiredMark
          />

          {/* 3. Contacto */}
          <InputConIcono
            className="col-span-1 md:col-span-6"
            label="Contacto"
            name="contacto"
            iconName="person"
            iconColorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
            placeholder="Nombre del contacto"
            defaultValue={state.payload?.contacto}
            errors={state.errors?.contacto}
          />

          {/* 4. Teléfono */}
          <InputConIcono
            className="col-span-1 md:col-span-6"
            label="Teléfono"
            name="telefono"
            type="tel"
            iconName="call"
            iconColorClass="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
            placeholder="+54 11 1234-5678"
            defaultValue={state.payload?.telefono}
            errors={state.errors?.telefono}
            requiredMark
          />

          {/* 5. Email */}
          <InputConIcono
            className="col-span-1 md:col-span-12"
            label="Correo Electrónico"
            name="email"
            type="email"
            iconName="mail"
            iconColorClass="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            placeholder="correo@empresa.com"
            defaultValue={state.payload?.email}
            errors={state.errors?.email}
          />

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
        
        <BotonAccion 
          type="submit"
          isPending={isPending}
          texto="Guardar Proveedor"
          textoCargando="Guardando..."
          icono="save"
        />
      </div>
    </form>
  );
}