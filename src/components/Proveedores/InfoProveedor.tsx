interface InfoProveedorProps {
  proveedor: {
    codigo: string;
    razonSocial: string;
    contacto?: string | null;
    telefono?: string | null;
    email?: string | null;
  };
}

export default function InfoProveedor({ proveedor }: InfoProveedorProps) {
  return (
    <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-8">
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">qr_code</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Código</h3>
            <p className="text-base font-semibold text-gray-900 dark:text-white">{proveedor.codigo}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">business</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Razón Social</h3>
            <p className="text-base font-medium text-gray-900 dark:text-white">{proveedor.razonSocial}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">person</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Contacto Principal</h3>
            <p className="text-base font-medium text-gray-900 dark:text-white">{proveedor.contacto || "-"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">call</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Teléfono</h3>
            <p className="text-base font-medium text-gray-900 dark:text-white">{proveedor.telefono || "-"}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">mail</span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email</h3>
            <p className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{proveedor.email || "-"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}