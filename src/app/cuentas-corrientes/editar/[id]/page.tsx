import { obtenerClientePorId, actualizarCliente, eliminarCliente } from "@/actions/cuentas-corrientes";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditarClienteForm from "@/components/EditarClienteForm/EditarClienteForm"; // Asegúrate de importar el componente creado arriba

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
    <div className="flex flex-col min-h-screen bg-[#f6f6f8] dark:bg-[#101622] text-[#111318] dark:text-white font-display">

      <main className="flex-1 w-full max-w-300 mx-auto px-4 py-8 md:px-8">
        
        {/* BREADCRUMBS CON ESTILOS SOLICITADOS */}
        <nav className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
            <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">
                Panel
            </Link>
            <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
            <Link href="/cuentas-corrientes" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">
                Cuentas Corrientes
            </Link>
            <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
            <p className="text-black dark:text-white font-bold">Editar Cuenta</p>
        </nav>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111318] dark:text-white mb-2">Editar Cuenta Corriente</h1>
          <p className="text-[#616f89] dark:text-gray-400">Actualice la información de la cuenta corriente del cliente seleccionado.</p>
        </div>

        {/* COMPONENTE CLIENTE DEL FORMULARIO */}
        {/* Le pasamos el cliente y las acciones del servidor */}
        <EditarClienteForm 
            cliente={cliente} 
            actualizarAction={actualizarConId} 
            eliminarAction={eliminarConId}
        />

      </main>
    </div>
  );
}