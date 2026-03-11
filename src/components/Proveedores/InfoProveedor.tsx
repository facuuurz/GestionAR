import InfoCard from "@/components/Proveedores/ui/InfoCard";

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
        
        <InfoCard 
          iconName="qr_code"
          iconColorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          title="Código"
          value={<span className="font-semibold">{proveedor.codigo}</span>}
        />

        <InfoCard 
          iconName="business"
          iconColorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          title="Razón Social"
          value={proveedor.razonSocial}
        />

        <InfoCard 
          iconName="person"
          iconColorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          title="Contacto Principal"
          value={proveedor.contacto || "-"}
        />

        <InfoCard 
          iconName="call"
          iconColorClass="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
          title="Teléfono"
          value={proveedor.telefono || "-"}
        />

        <InfoCard 
          iconName="mail"
          iconColorClass="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
          title="Email"
          value={
            proveedor.email ? (
              <a href={`mailto:${proveedor.email}`} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                {proveedor.email}
              </a>
            ) : (
              "-"
            )
          }
        />

      </div>
    </div>
  );
}