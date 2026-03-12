"use client";

import { useActionState, useState, startTransition } from "react";
import { actualizarProveedor, eliminarProveedor, State } from "@/actions/proveedores";
import Link from "next/link";

// Importamos el Modal
import EliminarProveedorModal from "@/components/Proveedores/Modal/EliminarProveedorModal";

// --- IMPORTAMOS LOS COMPONENTES UI ATÓMICOS ---
import InputConIcono from "@/components/Proveedores/ui/InputConIcono";
import BotonAccion from "@/components/Proveedores/ui/BotonAccion";

interface ProveedorData {
  id: number;
  codigo: string;
  razonSocial: string;
  contacto?: string | null;
  telefono?: string | null;
  email?: string | null;
}

export default function EditarProveedorForm({ proveedor }: { proveedor: ProveedorData }) {
  const initialState: State = { message: null, errors: {} };
  
  // Hooks de Acciones
  const [stateUpdate, formActionUpdate, isPendingUpdate] = useActionState(actualizarProveedor, initialState);
  const [stateDelete, formActionDelete, isPendingDelete] = useActionState(eliminarProveedor, initialState);

  // Estado para controlar el Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Función para confirmar la eliminación (Se ejecuta al dar "Sí" en el modal)
  const handleConfirmDelete = () => {
      const formData = new FormData();
      formData.append("id", proveedor.id.toString());
      
      startTransition(() => {
          formActionDelete(formData);
      });
      setShowDeleteModal(false); 
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

              {/* --- TUS INPUTS CON COMPONENTES UI --- */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* 1. Código */}
                <InputConIcono
                  className="col-span-1 md:col-span-6"
                  label="Código"
                  name="codigo"
                  iconName="badge"
                  iconColorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  defaultValue={stateUpdate.payload?.codigo || proveedor.codigo}
                  errors={stateUpdate.errors?.codigo}
                  requiredMark
                />

                {/* 2. Razón Social */}
                <InputConIcono
                  className="col-span-1 md:col-span-6"
                  label="Razón Social"
                  name="razonSocial"
                  iconName="domain"
                  iconColorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                  defaultValue={stateUpdate.payload?.razonSocial || proveedor.razonSocial}
                  errors={stateUpdate.errors?.razonSocial}
                  requiredMark
                />

                {/* 3. Contacto */}
                <InputConIcono
                  className="col-span-1 md:col-span-6"
                  label="Contacto"
                  name="contacto"
                  iconName="person"
                  iconColorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                  defaultValue={stateUpdate.payload?.contacto || proveedor.contacto || ""}
                  errors={stateUpdate.errors?.contacto}
                />

                {/* 4. Teléfono */}
                <InputConIcono
                  className="col-span-1 md:col-span-6"
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  iconName="call"
                  iconColorClass="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                  defaultValue={stateUpdate.payload?.telefono || proveedor.telefono || ""}
                  errors={stateUpdate.errors?.telefono}
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
                  defaultValue={stateUpdate.payload?.email || proveedor.email || ""}
                  errors={stateUpdate.errors?.email}
                />

              </div>
            </div>

            {/* Footer Botones */}
            <div className="px-6 md:px-8 py-5 bg-[#f8f9fa] dark:bg-gray-800/50 border-t border-[#e5e7eb] dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
               
               {/* BOTÓN ELIMINAR */}
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
                  
                  {/* BOTÓN ACTUALIZAR (Atómico) */}
                  <BotonAccion 
                    type="submit"
                    isPending={isPendingUpdate || isPendingDelete}
                    texto="Guardar Cambios"
                    textoCargando="Guardando..."
                    icono="save"
                  />
               </div>
            </div>
          </form>
        </div>
      </main>

      {/* RENDERIZAR EL MODAL */}
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