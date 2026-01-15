"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { actualizarProducto, eliminarProducto, State } from "@/actions/productos";

// --- TIPOS ---
interface ProductFormProps {
  producto: {
    id: number;
    codigoBarra: string;
    nombre: string;
    stock: number;
    precio: number;
    tipo: string;
    proveedor: string;
    descripcion: string;
  };
}

// --- CONFIG DE COLORES ---
const themeClasses: any = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400", groupFocus: "group-focus-within:bg-indigo-100 dark:group-focus-within:bg-indigo-500/30", ring: "focus:ring-indigo-500/20 focus:border-indigo-500" },
  blue: { bg: "bg-blue-50 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400", groupFocus: "group-focus-within:bg-blue-100 dark:group-focus-within:bg-blue-500/30", ring: "focus:ring-blue-500/20 focus:border-blue-500" },
  orange: { bg: "bg-orange-50 dark:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400", groupFocus: "group-focus-within:bg-orange-100 dark:group-focus-within:bg-orange-500/30", ring: "focus:ring-orange-500/20 focus:border-orange-500" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", groupFocus: "group-focus-within:bg-emerald-100 dark:group-focus-within:bg-emerald-500/30", ring: "focus:ring-emerald-500/20 focus:border-emerald-500" },
  purple: { bg: "bg-purple-50 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400", groupFocus: "group-focus-within:bg-purple-100 dark:group-focus-within:bg-purple-500/30", ring: "focus:ring-purple-500/20 focus:border-purple-500" },
  cyan: { bg: "bg-cyan-50 dark:bg-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400", groupFocus: "group-focus-within:bg-cyan-100 dark:group-focus-within:bg-cyan-500/30", ring: "focus:ring-cyan-500/20 focus:border-cyan-500" },
};

// --- COMPONENTES AUXILIARES ---
function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {errors[0]}
    </p>
  );
}

function FormInput({ label, name, defaultValue, type = "text", placeholder, icon, theme, step, error }: any) {
  const t = themeClasses[theme] || themeClasses.indigo;

  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-slate-700 dark:text-slate-300 text-sm font-bold">
        {label} <span className="text-red-500">*</span>
      </span>
      <div className="relative group">
        <div className={`absolute top-1.5 left-1.5 bottom-1.5 w-10 rounded-md flex items-center justify-center transition-colors ${t.bg} ${t.text} ${t.groupFocus}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          key={defaultValue} 
          step={step}
          placeholder={placeholder}
          className={`w-full h-12 pl-14 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 outline-none transition-all font-medium ${t.ring}
          ${error ? 'border-red-500' : ''}`}
        />
      </div>
      <ErrorMessage errors={error} />
    </label>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function EditProductForm({ producto }: ProductFormProps) {
  const [descLength, setDescLength] = useState(producto.descripcion?.length || 0);
  const maxChars = 200;

  const initialState: State = { message: null, errors: {} };
  const [state, dispatch, isPending] = useActionState<State, FormData>(actualizarProducto, initialState);

  const selectTheme = themeClasses.purple;

  return (
    <form action={dispatch} className="flex flex-col gap-8">
      <input type="hidden" name="id" value={producto.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        
        <FormInput
          label="Código de barra"
          name="codigoBarra"
          defaultValue={state.payload?.codigoBarra ?? producto.codigoBarra}
          placeholder="Ej: 7791234567890"
          icon="qr_code_2"
          theme="indigo"
          error={state.errors?.codigoBarra}
        />

        <FormInput
          label="Nombre del producto"
          name="nombre"
          defaultValue={state.payload?.nombre ?? producto.nombre}
          placeholder="Ej: Coca Cola 2.25L"
          icon="shopping_bag"
          theme="blue"
          error={state.errors?.nombre}
        />

        <FormInput
          label="Stock"
          name="stock"
          type="number"
          defaultValue={state.payload?.stock ?? producto.stock}
          placeholder="0"
          icon="inventory_2"
          theme="orange"
          error={state.errors?.stock}
        />

        <FormInput
          label="Precio Unitario"
          name="precio"
          type="number"
          step="0.01"
          defaultValue={state.payload?.precio ?? producto.precio}
          placeholder="0.00"
          icon="attach_money"
          theme="emerald"
          error={state.errors?.precio}
        />

        {/* SELECT */}
        <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300 text-sm font-bold">
                    Tipo de Producto <span className="text-red-500">*</span>
                </span>
                <button type="button" className="text-xs font-bold text-[#135bec] hover:text-[#0e4ac2] flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">add</span> Agregar Tipo
                </button>
            </div>
            <div className="relative group">
                <div className={`absolute top-1.5 left-1.5 bottom-1.5 w-10 rounded-md flex items-center justify-center transition-colors pointer-events-none z-10 ${selectTheme.bg} ${selectTheme.text} ${selectTheme.groupFocus}`}>
                    <span className="material-symbols-outlined text-[20px]">category</span>
                </div>
                <select
                    name="tipo"
                    defaultValue={state.payload?.tipo ?? producto.tipo}
                    key={state.payload?.tipo ?? producto.tipo}
                    className={`w-full h-12 pl-14 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 outline-none transition-all font-medium appearance-none cursor-pointer ${selectTheme.ring} ${state.errors?.tipo ? 'border-red-500' : ''}`}
                >
                    <option value="">Seleccione una opción</option>
                    <option value="Almacén">Almacén</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Lácteos">Lácteos</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Otros">Otros</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                    <span className="material-symbols-outlined">expand_more</span>
                </div>
            </div>
            <ErrorMessage errors={state.errors?.tipo} />
        </div>

        <FormInput
          label="Código de Proveedor"
          name="proveedor"
          defaultValue={state.payload?.proveedor ?? producto.proveedor}
          placeholder="Ej: PROV-001"
          icon="local_shipping"
          theme="cyan"
          error={state.errors?.proveedor}
        />
        
        {/* DESCRIPCIÓN */}
        <div className="md:col-span-2">
            <label className="flex flex-col gap-1.5">
                <div className="flex justify-between items-end">
                    <span className="text-slate-700 dark:text-slate-300 text-sm font-bold">Descripción breve</span>
                    <span className={`text-xs font-bold transition-colors ${
                        descLength >= maxChars ? "text-red-500" : "text-slate-400"
                    }`}>
                        (Opcional {descLength} de {maxChars})
                    </span>
                </div>
                
                <div className="relative group">
                    <div className="absolute top-1.5 left-1.5 h-10 w-10 rounded-md flex items-center justify-center transition-colors bg-pink-50 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 group-focus-within:bg-pink-100 dark:group-focus-within:bg-pink-500/30">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                    </div>
                    
                    <textarea
                        name="descripcion"
                        maxLength={maxChars}
                        defaultValue={state.payload?.descripcion ?? producto.descripcion ?? ""}
                        key={state.payload?.descripcion ?? producto.descripcion ?? "desc"}
                        onChange={(e) => setDescLength(e.target.value.length)}
                        placeholder="Breve descripción del producto..."
                        className={`w-full min-h-12 py-3 pl-14 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all font-medium resize-none overflow-hidden hover:overflow-y-auto focus:h-24 ${state.errors?.descripcion ? 'border-red-500' : ''}`}
                        style={{ lineHeight: '1.5' }}
                    />
                </div>
                <ErrorMessage errors={state.errors?.descripcion} />
            </label>
        </div>

      </div>

      <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

      {/* SECCIÓN DE BOTONES ADAPTADA A LA ESTÉTICA SOLICITADA */}
      <div className="flex flex-col items-end gap-2">
          {state.message && (
             <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-sm w-full text-center">
                 {state.message}
             </div>
          )}

          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 w-full">
            
            {/* BOTÓN ELIMINAR (Estilo 'Agregar Producto' pero en Rojo) */}
            <button
              formAction={eliminarProducto}
              className="w-full md:w-auto h-10 px-4 rounded-lg bg-red-600 text-white font-bold text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              Eliminar Producto
            </button>

            <div className="flex flex-col-reverse md:flex-row gap-4 w-full md:w-auto">
              
              {/* BOTÓN CANCELAR (Estilo 'Agregar Producto') */}
              <Link
                href="/inventario"
                className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Cancelar
              </Link>

              {/* BOTÓN GUARDAR (Estilo 'Agregar Producto') */}
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
      </div>
    </form>
  );
}