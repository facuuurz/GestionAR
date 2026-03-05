import Link from "next/link";

interface EncabezadoDetalleProps {
  proveedorId: number;
  razonSocial: string;
}

export default function EncabezadoDetalle({ proveedorId, razonSocial }: EncabezadoDetalleProps) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="flex mb-6">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <li className="inline-flex items-center hover:text-gray-700 dark:hover:text-gray-200">
            <Link href="/">Panel</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
              <Link className="hover:text-gray-700 dark:hover:text-gray-200" href="/proveedores">Proveedores</Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
              <span className="font-medium text-gray-900 dark:text-white">{razonSocial}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{razonSocial}</h1>
          <p className="text-gray-500 dark:text-gray-400">Detalles del proveedor y catálogo de productos asociados.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href={`/proveedores/editar/${proveedorId}`}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A202C] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Editar
          </Link>
        </div>
      </div>
    </>
  );
}