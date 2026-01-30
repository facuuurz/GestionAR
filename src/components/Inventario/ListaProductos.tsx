import Link from "next/link";

interface ProductRowProps {
  prod: any; 
}

export default function ProductRow({ prod }: ProductRowProps) {
  // --- 1. LÓGICA DE STOCK ---
  const isZero = prod.stock === 0;
  const isLow = prod.stock > 0 && prod.stock < 20; 
  const isGood = prod.stock >= 20; 
  
  let stockColorClass = '';
  if (isZero) {
    stockColorClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  } else if (isLow) {
    stockColorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  } else {
    stockColorClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  }

  // --- 2. LÓGICA DE TEXTO ---
  const descripcionCorta = prod.descripcion && prod.descripcion.length > 50 
    ? prod.descripcion.substring(0, 50) + "..." 
    : prod.descripcion;

  const labelUnidad = prod.stock === 1 ? "ud." : "uds.";

  // --- 3. LÓGICA DE VENCIMIENTO ---
  const fechaObj = prod.fechaVencimiento ? new Date(prod.fechaVencimiento) : null;
  const hoy = new Date();
  
  let diasRestantes = null;
  if (fechaObj) {
      const diffTime = fechaObj.getTime() - hoy.getTime();
      diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }

  // 🆕 ESTILOS ACTUALIZADOS CON BG POR DEFECTO
  // Definimos las clases base para todos los estados de fecha
  const baseFechaClass = "font-bold px-2 py-0.5 rounded text-xs inline-block";
  let fechaClass = `${baseFechaClass} text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300`; 

  if (diasRestantes !== null) {
      if (diasRestantes < 0) {
          // Vencido
          fechaClass = `${baseFechaClass} text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300`;
      } else if (diasRestantes <= 30) {
          // Por vencer
          fechaClass = `${baseFechaClass} text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300`;
      }
  }
  
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
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${stockColorClass}`}>
          {isLow && <span className="material-symbols-outlined text-[16px] mr-1.5">warning</span>}
          {isZero && <span className="material-symbols-outlined text-[16px] mr-1.5">error</span>}
          {isGood && <span className="material-symbols-outlined text-[16px] mr-1.5">check_circle</span>}
          {prod.stock} {labelUnidad}
        </span>
      </td>

      {/* VENCIMIENTO ACTUALIZADO */}
      <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
        <div className="flex flex-col items-center"> 
          {fechaObj ? (
            <>
              <span className={fechaClass}>
                {fechaObj.toLocaleDateString()}
              </span>
              
              {diasRestantes !== null && diasRestantes < 0 && (
                <span className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">
                  Vencido
                </span>
              )}
            </>
          ) : (
            <span className="text-neutral-300 dark:text-neutral-600">-</span>
          )}
        </div>
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
          <span className="material-symbols-outlined text-[16px]">
            edit 
          </span>
          <span>Actualizar</span>
        </Link>
      </td>
    </tr>
  );
}