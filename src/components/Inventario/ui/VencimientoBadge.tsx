interface VencimientoBadgeProps {
  fechaVencimiento: Date | string | null | undefined;
  className?: string;
  showIcon?: boolean;
}

export default function VencimientoBadge({ fechaVencimiento, className = "", showIcon = false }: VencimientoBadgeProps) {
  if (!fechaVencimiento) {
    return (
      <span className={`text-neutral-300 dark:text-neutral-600 ${className}`}>
        -
      </span>
    );
  }

  const fechaObj = new Date(fechaVencimiento);
  const hoy = new Date();
  
  const diffTime = fechaObj.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const baseClass = "font-bold px-2 py-0.5 rounded text-xs inline-flex items-center gap-1";
  let colorClass = "text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300";
  let statusText = null;

  if (diasRestantes < 0) {
    colorClass = "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300";
    statusText = "Vencido";
  } else if (diasRestantes <= 30) {
    colorClass = "text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300";
    statusText = `Vence en ${diasRestantes}d`;
  }

  // Formato DD/MM/YYYY en UTC local (o directamente toLocaleDateString si prefieres)
  const formattedDate = fechaObj.toLocaleDateString();

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className={`${baseClass} ${colorClass}`}>
        {showIcon && <span className="material-symbols-outlined text-[14px]">event</span>}
        {formattedDate}
      </span>
      {statusText && (
        <span className={`text-[10px] font-bold mt-1 uppercase tracking-wider ${diasRestantes < 0 ? 'text-red-500' : 'text-orange-500'}`}>
          {statusText}
        </span>
      )}
    </div>
  );
}
