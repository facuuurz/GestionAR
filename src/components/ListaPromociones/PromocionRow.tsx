import Link from "next/link";

interface PromocionRowProps {
  promo: any;
}

export default function PromocionRow({ promo }: PromocionRowProps) {
  
  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Función para formatear fechas
  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };

  // --- LOGICA DE ESTADO MODIFICADA ---
  const getEstadoPromocion = (inicio: Date | string, fin: Date | string) => {
    const hoy = new Date();
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    if (hoy > fechaFin) {
      return { 
        label: "Vencido", 
        badgeColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        btnText: "Reactivar",
        btnIcon: "restore",
        // NUEVO: Color verde vibrante para la acción de reactivar
        btnColor: "bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
      };
    } else if (hoy < fechaInicio) {
      return { 
        label: "Programado", 
        badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        btnText: "Actualizar",
        btnIcon: "edit",
        // NUEVO: Color neutro original
        btnColor: "bg-neutral-800 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      };
    } else {
      return { 
        label: "Activo", 
        badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        btnText: "Actualizar",
        btnIcon: "edit",
         // NUEVO: Color neutro original
        btnColor: "bg-neutral-800 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      };
    }
  };

  const estado = getEstadoPromocion(promo.fechaInicio, promo.fechaFin);

  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
      
      {/* NOMBRE */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <Link 
             href={`/promociones/${promo.id}`} 
             className="text-left text-sm font-bold text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline hover:underline-offset-2 transition-colors"
          >
             {promo.nombre}
          </Link>
        </div>
      </td>

      {/* DESCRIPCIÓN */}
      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
        {promo.descripcion && promo.descripcion.length > 50 
          ? promo.descripcion.substring(0, 50) + "..." 
          : promo.descripcion}
      </td>

      {/* PRECIO */}
      <td className="px-4 py-3 text-sm font-medium text-primary dark:text-white">
        {formatCurrency(promo.precio)}
      </td>

      {/* VIGENCIA */}
      <td className="px-4 py-3 text-sm text-neutral-500 font-mono">
        <div className="flex items-center gap-2">
           <span className="material-symbols-outlined text-[16px]">calendar_today</span>
           {formatDate(promo.fechaInicio)} - {formatDate(promo.fechaFin)}
        </div>
      </td>

      {/* ESTADO */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${estado.badgeColor}`}>
          {estado.label}
        </span>
      </td>

      {/* ACCIONES MODIFICADAS */}
      <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-[#222] group-hover:bg-neutral-50 dark:group-hover:bg-[#333] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
        <Link 
          href={`/promociones/editar/${promo.id}`}
          // Se han quitado las clases de color fijas y se usa ${estado.btnColor}
          className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md w-28 justify-center ${estado.btnColor}`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {estado.btnIcon}
          </span>
          <span>{estado.btnText}</span>
        </Link>
      </td>
    </tr>
  );
}