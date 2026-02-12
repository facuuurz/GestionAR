"use client";

import { useActionState, useState, startTransition } from "react"; // 1. Importamos useState
import { actualizarProveedor, eliminarProveedor, State } from "@/actions/proveedores";
import Link from "next/link";
// 2. Importamos el nuevo modal
import EliminarProveedorModal from "@/components/Proveedores/Modal/EliminarProveedorModal";

interface ProveedorData {
  id: number;
  codigo: string;
  razonSocial: string;
  contacto?: string | null;
  telefono?: string | null;
  email?: string | null;
}

function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
      <span className="material-symbols-outlined text-[16px]">error</span>
      {errors[0]}
    </p>
  );
}

export default function EditarProveedorForm({ proveedor }: { proveedor: ProveedorData }) {
  const initialState: State = { message: null, errors: {} };
  
  // Hooks de Acciones
  const [stateUpdate, formActionUpdate, isPendingUpdate] = useActionState(actualizarProveedor, initialState);
  const [stateDelete, formActionDelete, isPendingDelete] = useActionState(eliminarProveedor, initialState);

  // 3. Estado para controlar el Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 4. Función para confirmar la eliminación (Se ejecuta al dar "Sí" en el modal)
  const handleConfirmDelete = () => {
      // Como estamos llamando a la acción manualmente (no desde un submit de form),
      // creamos el FormData con el ID.
      const formData = new FormData();
      formData.append("id", proveedor.id.toString());
      
      startTransition(() => {
          formActionDelete(formData);
      });
      setShowDeleteModal(false); // Cerramos el modal (la redirección la hace el server action)
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      <main className="flex-1 flex flex-col items-center py-8 px-6 lg:px-12 xl:px-40 w-full">
        <div className="flex flex-col w-full max-w-4xl"> 
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 px-1 pb-4">
            <Link href="/" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-white transition-colors">Panel</Link>
            <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
            <Link href="/proveedores" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-white transition-colors">Proveedores</Link>
            <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
            <span className="text-[#0d121b] dark:text-gray-100 text-sm font-medium">Editar Proveedor</span>
          </div>

          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Editar Proveedor
            </h1>
            <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
              Actualice la información o elimine el proveedor.
            </p>
          </div>

          {/* Formulario Principal (Solo para actualizar) */}
          <form action={formActionUpdate} className="bg-white dark:bg-[#1A202C] rounded-xl border border-[#e5e7eb] dark:border-gray-700 shadow-sm overflow-hidden relative">
            
            <input type="hidden" name="id" value={proveedor.id} />

            <div className="border-b border-[#e5e7eb] dark:border-[#2d3748] px-6 py-4 bg-gray-50/50 dark:bg-[#1e2736]">
                <h3 className="text-base font-bold text-[#0d121b] dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined">edit_square</span>
                Información del Proveedor
                </h3>
            </div>

            <div className="p-6 md:p-8">
              {/* Mensajes de error de ACTUALIZACIÓN */}
              {stateUpdate.message && !Object.keys(stateUpdate.errors || {}).length && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    {stateUpdate.message}
                </div>
              )}

              {/* Mensajes de error de ELIMINACIÓN */}
              {stateDelete.message && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">warning</span>
                    {stateDelete.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* --- TUS INPUTS (Igual que antes) --- */}
                
                <div className="col-span-1 md:col-span-6">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="codigo">
                    Código <span className="text-black dark:text-white">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                    </div>
                    <input 
                      defaultValue={stateUpdate.payload?.codigo || proveedor.codigo}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900 
                        ${stateUpdate.errors?.codigo ? 'border-red-500' : 'border-transparent focus:border-[#135bec]'}`}
                      id="codigo" name="codigo" type="text"
                    />
                  </div>
                  <ErrorMessage errors={stateUpdate.errors?.codigo} />
                </div>

                <div className="col-span-1 md:col-span-6">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="razonSocial">
                    Razón Social <span className="text-black dark:text-white">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">domain</span>
                    </div>
                    <input 
                      defaultValue={stateUpdate.payload?.razonSocial || proveedor.razonSocial}
                      className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900
                        ${stateUpdate.errors?.razonSocial ? 'border-red-500' : 'border-transparent focus:border-[#135bec]'}`}
                      id="razonSocial" name="razonSocial" type="text"
                    />
                  </div>
                  <ErrorMessage errors={stateUpdate.errors?.razonSocial} />
                </div>

                <div className="col-span-1 md:col-span-6">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="contacto">Contacto</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <input 
                      defaultValue={stateUpdate.payload?.contacto || proveedor.contacto || ""}
                      className="w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 border-transparent focus:border-[#135bec] focus:bg-white dark:focus:bg-gray-900 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none" 
                      id="contacto" name="contacto" type="text"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-6">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="telefono">Teléfono</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </div>
                    <input 
                      defaultValue={stateUpdate.payload?.telefono || proveedor.telefono || ""}
                      className="w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 border-transparent focus:border-[#135bec] focus:bg-white dark:focus:bg-gray-900 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none" 
                      id="telefono" name="telefono" type="tel"
                    />
                  </div>
                  <ErrorMessage errors={stateUpdate.errors?.telefono} />
                </div>

                <div className="col-span-1 md:col-span-12">
                  <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2" htmlFor="email">Correo Electrónico</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </div>
                    <input 
                      defaultValue={stateUpdate.payload?.email || proveedor.email || ""}
                      className="w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 border-transparent focus:border-[#135bec] focus:bg-white dark:focus:bg-gray-900 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none" 
                      id="email" name="email" type="email"
                    />
                  </div>
                  <ErrorMessage errors={stateUpdate.errors?.email} />
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 py-5 bg-[#f8f9fa] dark:bg-gray-800/50 border-t border-[#e5e7eb] dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
               
               {/* 5. BOTÓN ELIMINAR: Tipo 'button' y abre el modal */}
               <button 
                  type="button" 
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isPendingDelete || isPendingUpdate}
                  className={`w-full md:w-auto h-10 px-4 rounded-lg bg-red-600 text-white font-bold text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer
                    ${(isPendingDelete || isPendingUpdate) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
               >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Eliminar Proveedor
               </button>

               <div className="flex flex-col-reverse sm:flex-row gap-3 w-full md:w-auto">
                  <Link 
                    href="/proveedores" 
                    className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-gray-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-gray-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                  >
                    Cancelar
                  </Link>
                  
                  <button 
                    type="submit" 
                    disabled={isPendingUpdate || isPendingDelete}
                    className={`hover:cursor-pointer w-full md:w-auto h-10 px-6 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
                      ${(isPendingUpdate || isPendingDelete) ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black dark:bg-[#135bec] dark:hover:bg-blue-600'}
                    `}
                  >
                    {isPendingUpdate ? (
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
      </main>

      {/* 6. RENDERIZAR EL MODAL */}
      <EliminarProveedorModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isPendingDelete}
        nombreProveedor={proveedor.razonSocial}
      />

    </div>
  );
}