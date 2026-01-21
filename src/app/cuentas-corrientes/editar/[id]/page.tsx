import { obtenerClientePorId, actualizarCliente, eliminarCliente } from "@/actions/cuentas-corrientes";
import Link from "next/link";
import { notFound } from "next/navigation";
import BotonEliminar from "@/components/BotonEliminar/BotonEliminar";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: PageProps) {
  const { id } = await params;
  const clienteId = parseInt(id);
  
  if (isNaN(clienteId)) return notFound();
  
  const cliente = await obtenerClientePorId(clienteId);
  if (!cliente) return notFound();

  // Bind del ID para las acciones
  const actualizarConId = actualizarCliente.bind(null, clienteId);
  const eliminarConId = eliminarCliente.bind(null, clienteId);

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white">

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8 md:px-8">
        
        {/* BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="flex items-center text-sm mb-6">
          <ol className="flex items-center space-x-2">
            <li><Link className="text-[#616f89] hover:text-primary dark:text-gray-400 font-medium" href="/">Panel</Link></li>
            <li><span className="text-[#9ca3af] dark:text-gray-600">&gt;</span></li>
            <li><Link className="text-[#616f89] hover:text-primary dark:text-gray-400 font-medium" href="/cuentas-corrientes">Cuentas Corrientes</Link></li>
            <li><span className="text-[#9ca3af] dark:text-gray-600">&gt;</span></li>
            <li><span className="text-[#111318] dark:text-white font-semibold">Editar</span></li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111318] dark:text-white mb-2">Editar Cuenta Corriente</h1>
          <p className="text-[#616f89] dark:text-gray-400">Actualice la información y saldo de la cuenta corriente.</p>
        </div>

        <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm overflow-hidden">
          
          {/* FORMULARIO DE EDICIÓN */}
          <form action={actualizarConId} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Nombre */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Nombre / Razón Social</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 flex items-center justify-center size-8 rounded bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300">
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
              </div>

              {/* CUIT */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">CUIT / CUIL</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 flex items-center justify-center size-8 rounded bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300">
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                  </div>
                  <input 
                    name="cuit"
                    defaultValue={cliente.cuit || ""}
                    className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                    type="text"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Dirección</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 flex items-center justify-center size-8 rounded bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                  </div>
                  <input 
                    name="direccion"
                    defaultValue={cliente.direccion || ""}
                    className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                    type="text"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Teléfono</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 flex items-center justify-center size-8 rounded bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                  </div>
                  <input 
                    name="telefono"
                    defaultValue={cliente.telefono || ""}
                    className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                    type="tel"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Email</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 flex items-center justify-center size-8 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <input 
                    name="email"
                    defaultValue={cliente.email || ""}
                    className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all" 
                    type="email"
                  />
                </div>
              </div>

              {/* SALDO (Editable) */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-[#111318] dark:text-gray-200">Saldo Actual ($)</label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 flex items-center justify-center size-8 rounded bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                  </div>
                  <input 
                    name="saldo"
                    defaultValue={cliente.saldo?.toString() || "0"}
                    className="w-full h-12 pl-14 pr-4 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white placeholder-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all font-mono font-bold" 
                    type="number"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-[#616f89] dark:text-gray-400 mt-1">
                    ⚠️ Modificar esto altera la deuda del cliente directamente sin generar un movimiento.
                </p>
              </div>

            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="mt-8 pt-6 border-t border-[#f0f2f4] dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
               {/* Botón Guardar (Form submit) */}
               <div className="w-full md:w-auto flex justify-end gap-3 md:order-2">
                 <Link 
                    href="/cuentas-corrientes"
                    className="px-5 py-2.5 rounded-lg border border-[#dbdfe6] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111318] dark:text-white text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                 >
                    Cancelar
                 </Link>
                 <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2"
                 >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Guardar Cambios
                 </button>
               </div>
            </div>
          </form>

          {/* FORMULARIO APARTE PARA ELIMINAR */}
          <div className="px-6 md:px-8 pb-8">
                <BotonEliminar eliminarAction={eliminarConId} />
            </div>
        </div>
      </main>
    </div>
  );
}