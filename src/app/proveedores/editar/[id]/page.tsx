import { prisma } from "@/lib/prisma";
import { actualizarProveedor, eliminarProveedor } from "@/actions/proveedores";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditarProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNumerico = parseInt(id);

  // 1. Obtener datos del proveedor
  const proveedor = await prisma.proveedor.findUnique({
    where: { id: idNumerico },
  });

  if (!proveedor) {
    redirect("/proveedores");
  }

  // Colores para iconos
  const colors = {
    blue: "bg-blue-500/20 text-blue-500",
    purple: "bg-purple-500/20 text-purple-500",
    orange: "bg-orange-500/20 text-orange-500",
    green: "bg-green-500/20 text-green-500",
    cyan: "bg-cyan-500/20 text-cyan-500",
    primary: "bg-[#13ec13]/20 text-[#13ec13]",
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0a0a0a] min-h-screen text-slate-900 dark:text-slate-100 font-sans pb-20">
 
      <main className="flex flex-1 justify-center py-8">
        <div className="layout-content-container flex flex-col w-full max-w-[960px] px-4">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 py-2 mb-2">
            <Link className="text-slate-900 dark:text-white text-sm font-medium hover:underline" href="/">Panel</Link>
            <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">/</span>
            <Link className="text-slate-900 dark:text-white text-sm font-medium hover:underline" href="/proveedores">Proveedores</Link>
            <span className="text-slate-400 dark:text-slate-600 text-sm font-medium">/</span>
            <span className="text-[#13ec13] text-sm font-medium">Editar: {proveedor.razonSocial}</span>
          </div>

          <div className="flex flex-wrap justify-between gap-3 py-4 mb-6">
            <div className="flex min-w-72 flex-col gap-1">
              <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Editar Proveedor</p>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Actualice la información del proveedor en el sistema</p>
            </div>
          </div>

          {/* FORMULARIO */}
          <form action={actualizarProveedor} className="bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-[#2a2a2a] p-6 lg:p-10">
            
            <input type="hidden" name="id" value={proveedor.id} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Código (Solo lectura) */}
              <div className="flex flex-col gap-2">
                <p className="text-slate-900 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                  <span className={`flex items-center justify-center size-6 rounded-md ${colors.blue}`}>
                    <span className="material-symbols-outlined text-xs">tag</span>
                  </span>
                  Código del Proveedor
                </p>
                <input 
                  className="flex w-full rounded-lg text-slate-500 dark:text-gray-400 border-slate-300 dark:border-[#2a2a2a] bg-slate-100 dark:bg-[#1e1e1e] h-12 px-4 text-base font-normal cursor-not-allowed opacity-80 outline-none" 
                  readOnly 
                  type="text" 
                  value={proveedor.codigo} 
                />
              </div>

              {/* Razón Social */}
              <div className="flex flex-col gap-2">
                <p className="text-slate-900 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                  <span className={`flex items-center justify-center size-6 rounded-md ${colors.purple}`}>
                    <span className="material-symbols-outlined text-xs">business</span>
                  </span>
                  Razón Social
                </p>
                <input 
                  name="razon_social"
                  defaultValue={proveedor.razonSocial}
                  className="flex w-full rounded-lg text-slate-900 dark:text-white border-slate-300 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1e1e1e] h-12 px-4 text-base font-normal focus:ring-2 focus:ring-[#13ec13] focus:border-transparent outline-none transition-all" 
                  type="text" 
                />
              </div>

              {/* Contacto */}
              <div className="flex flex-col gap-2">
                <p className="text-slate-900 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                  <span className={`flex items-center justify-center size-6 rounded-md ${colors.orange}`}>
                    <span className="material-symbols-outlined text-xs">person</span>
                  </span>
                  Contacto
                </p>
                <input 
                  name="contacto"
                  defaultValue={proveedor.contacto || ""}
                  className="flex w-full rounded-lg text-slate-900 dark:text-white border-slate-300 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1e1e1e] h-12 px-4 text-base font-normal focus:ring-2 focus:ring-[#13ec13] focus:border-transparent outline-none transition-all" 
                  type="text" 
                />
              </div>

              {/* Teléfono */}
              <div className="flex flex-col gap-2">
                <p className="text-slate-900 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                  <span className={`flex items-center justify-center size-6 rounded-md ${colors.green}`}>
                    <span className="material-symbols-outlined text-xs">call</span>
                  </span>
                  Teléfono
                </p>
                <input 
                  name="telefono"
                  defaultValue={proveedor.telefono || ""}
                  className="flex w-full rounded-lg text-slate-900 dark:text-white border-slate-300 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1e1e1e] h-12 px-4 text-base font-normal focus:ring-2 focus:ring-[#13ec13] focus:border-transparent outline-none transition-all" 
                  type="tel" 
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <p className="text-slate-900 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                  <span className={`flex items-center justify-center size-6 rounded-md ${colors.cyan}`}>
                    <span className="material-symbols-outlined text-xs">mail</span>
                  </span>
                  Email
                </p>
                <input 
                  name="email"
                  defaultValue={proveedor.email || ""}
                  className="flex w-full rounded-lg text-slate-900 dark:text-white border-slate-300 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1e1e1e] h-12 px-4 text-base font-normal focus:ring-2 focus:ring-[#13ec13] focus:border-transparent outline-none transition-all" 
                  type="email" 
                />
              </div>

              {/* Estado */}
              <div className="flex flex-col gap-2">
                <p className="text-slate-900 dark:text-slate-200 text-sm font-semibold flex items-center gap-2">
                  <span className={`flex items-center justify-center size-6 rounded-md ${colors.primary}`}>
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                  </span>
                  Estado
                </p>
                <div className="relative">
                  <select 
                    name="estado"
                    defaultValue={proveedor.estado}
                    className="flex w-full rounded-lg text-slate-900 dark:text-white border-slate-300 dark:border-[#2a2a2a] bg-slate-50 dark:bg-[#1e1e1e] h-12 px-4 text-base font-normal appearance-none focus:ring-2 focus:ring-[#13ec13] focus:border-transparent outline-none transition-all cursor-pointer"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-12 pt-8 border-t border-slate-200 dark:border-[#2a2a2a]">
              
              <button 
                formAction={eliminarProveedor}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all group"
              >
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">delete</span>
                Eliminar Proveedor
              </button>

              <button 
                type="submit"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 h-12 bg-black dark:bg-white text-white dark:text-black font-black rounded-lg hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all border border-transparent shadow-lg active:scale-95"
              >
                <span className="material-symbols-outlined text-xl">save</span>
                Guardar Cambios
              </button>
            </div>

          </form>

          {/* Info Footer */}
          <div className="mt-8 p-4 bg-[#13ec13]/5 rounded-lg border border-[#13ec13]/20 flex items-start gap-4">
            <span className="material-symbols-outlined text-[#13ec13] mt-0.5">info</span>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Última actualización</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {new Date(proveedor.updatedAt).toLocaleDateString()} - {new Date(proveedor.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}