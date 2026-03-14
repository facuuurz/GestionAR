import Link from "next/link";
import EstadoStockBadge from "@/components/Inventario/ui/EstadoStockBadge";
import VencimientoBadge from "@/components/Inventario/ui/VencimientoBadge";
import BotonAccion from "@/components/Inventario/ui/BotonAccion";

interface ProductRowProps {
  prod: any; 
  isAdmin?: boolean;
}

export default function ProductRow({ prod, isAdmin = true }: ProductRowProps) {
  let displayPrecio = `$${Number(prod.precio).toFixed(2)}`;
  
  if (prod.esPorPeso) {
      displayPrecio += " /kg";
  }

  // --- 2. LÓGICA DE TEXTO ---
  const descripcionCorta = prod.descripcion && prod.descripcion.length > 50 
    ? prod.descripcion.substring(0, 50) + "..." 
    : prod.descripcion;
  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
      
      {/* CÓDIGO */}
      <td className="px-4 py-3 text-sm font-bold dark:text-neutral-400 font-mono hover:underline hover:text-blue-600 cursor-pointer text-[#135bec]">
        <Link href={`/inventario/detalles-producto/${prod.id}`}>
          {prod.codigoBarra || prod.id}
        </Link>
      </td>

      {/* PRODUCTO */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <Link 
            href={`/inventario/detalles-producto/${prod.id}`}
            className="text-left text-sm font-bold text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline hover:underline-offset-2 transition-colors"
          >
            {prod.nombre}
          </Link>
          
          {prod.descripcion && (
            <span className="text-xs text-neutral-500 mt-0.5" title={prod.descripcion}>
                {descripcionCorta}
            </span>
          )}
        </div>
      </td>



      {/* STOCK */}
      <td className="px-4 py-3">
        <EstadoStockBadge stock={prod.stock} esPorPeso={prod.esPorPeso} />
      </td>

      {/* VENCIMIENTO ACTUALIZADO */}
      <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
        <VencimientoBadge fechaVencimiento={prod.fechaVencimiento} />
      </td>

      {/* PRECIO */}
      <td className="px-4 py-3 text-sm font-medium text-primary dark:text-white">
        {displayPrecio}
      </td>

      {/* TIPO */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-[#444] text-gray-800 dark:text-neutral-300">
          {prod.tipo || "Sin tipo"}
        </span>
      </td>

      {/* PROVEEDOR */}
      <td className="px-4 py-3 text-sm text-neutral-500 font-mono">
        {prod.proveedor || "-"}
      </td>
      
      {/* ACCIONES */}
      {isAdmin && (
        <td className="px-4 py-3 text-center sticky right-0 bg-[#f9f9f9] dark:bg-[#222] group-hover:bg-neutral-50 dark:group-hover:bg-[#333] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
          <Link 
            href={`/inventario/editar/${prod.id}`}
          >
            <BotonAccion 
              icon="edit" 
              label="Actualizar" 
              variant="solid" 
              color="primary"
              className="w-full h-8 px-3 text-[11px]" // Hacemos el botón un poco más chico para la tabla
            />
          </Link>
        </td>
      )}
    </tr>
  );
}