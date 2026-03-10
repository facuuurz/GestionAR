import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerClientePorId, actualizarCliente, eliminarCliente } from "@/actions/cuentas-corrientes";
import EditarClienteForm from "@/components/Cuentas-corrientes/EditarClienteForm"; // Ajusta la ruta si es necesario

export default async function EditarClientePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id);
  
  // 1. Obtener datos
  const cliente = await obtenerClientePorId(id);

  if (!cliente) {
    notFound();
  }

  // 2. Preparar acciones (Bind del ID)
  const actualizarConId = actualizarCliente.bind(null, cliente.id);
  const eliminarConId = eliminarCliente.bind(null, cliente.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] text-slate-800 dark:text-slate-200">
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-7xl">
            
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex mb-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="inline-flex items-center space-x-1 md:space-x-3">
                  <Link href="/" className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors">
                      Panel
                  </Link>
                  <span className="material-symbols-outlined text-neutral-400 text-base mx-2">chevron_right</span>
                  <Link href="/cuentas-corrientes" className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors">
                      Cuentas Corrientes
                  </Link>
                  <span className="material-symbols-outlined text-neutral-400 text-base mx-2">chevron_right</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                      Editar Cliente
                  </span>
              </div>
            </nav>

            {/* Título */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Editar Cliente</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">Modifique los detalles de la cuenta o elimínela.</p>
            </div>

            {/* Renderizar Formulario */}
            <EditarClienteForm 
                cliente={cliente} 
                actualizarAction={actualizarConId}
                eliminarAction={eliminarConId}    
            />

        </div>
      </main>
    </div>
  );
}