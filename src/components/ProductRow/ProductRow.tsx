import Link from "next/link";

interface ProductRowProps {
  prod: any; 
}

export default function ProductRow({ prod }: ProductRowProps) {
  // --- 1. LÓGICA DE COLORES Y ESTADOS ---
  const isZero = prod.stock === 0;
  const isLow = prod.stock > 0 && prod.stock < 20; // Menor a 20 (Amarillo)
  const isGood = prod.stock >= 20; // Mayor o igual a 20 (Verde)
  
  let stockColorClass = '';
  
  if (isZero) {
    stockColorClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  } else if (isLow) {
    stockColorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  } else {
    // Caso isGood
    stockColorClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  }

  // --- 2. LÓGICA DE TEXTO (DESCRIPCIÓN Y UNIDADES) ---
  const descripcionCorta = prod.descripcion && prod.descripcion.length > 50 
    ? prod.descripcion.substring(0, 50) + "..." 
    : prod.descripcion;

  // Determinar si es "ud." o "uds."
  const labelUnidad = prod.stock === 1 ? "ud." : "uds.";

  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
      
      {/* CÓDIGO */}
      <td className="px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 font-mono">
        {prod.codigoBarra || prod.id}
      </td>

      {/* PRODUCTO (Nombre + Descripción Corta) */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <Link 
            href={`/inventario/detalles-producto/${prod.id}`}
            className="text-left text-sm font-bold text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline hover:underline-offset-2 transition-colors"
          >
            {prod.nombre}
          </Link>
          
          {prod.descripcion && (
            <span 
                className="text-xs text-neutral-500 mt-0.5" 
                title={prod.descripcion} 
            >
                {descripcionCorta}
            </span>
          )}
        </div>
      </td>

      {/* STOCK CON ICONOS Y UNIDADES */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${stockColorClass}`}>
          
          {/* Icono para Stock Bajo (< 20 y > 0) */}
          {isLow && <span className="material-symbols-outlined text-[16px] mr-1.5">warning</span>}
          
          {/* Icono para Sin Stock (0) */}
          {isZero && <span className="material-symbols-outlined text-[16px] mr-1.5">error</span>}
          
          {/* Icono para Stock OK (>= 20) */}
          {isGood && <span className="material-symbols-outlined text-[16px] mr-1.5">check_circle</span>}
          
          {/* Número + ud./uds. */}
          {prod.stock} {labelUnidad}
        </span>
      </td>

      {/* PRECIO */}
      <td className="px-4 py-3 text-sm font-medium text-primary dark:text-white">
        ${Number(prod.precio).toFixed(2)}
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
      <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-[#222] group-hover:bg-neutral-50 dark:group-hover:bg-[#333] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
        <Link 
          href={`/inventario/editar/${prod.id}`}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black"
        >
          <span className="material-symbols-outlined text-[16px] transition-transform duration-500 ease-in-out">
            edit 
          </span>
          <span>Actualizar</span>
        </Link>
      </td>
    </tr>
  );
}