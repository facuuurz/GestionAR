interface EstadoStockBadgeProps {
  stock: number;
  esPorPeso: boolean;
  className?: string;
  showText?: boolean;
}

export default function EstadoStockBadge({ stock, esPorPeso, className = "", showText = true }: EstadoStockBadgeProps) {
  // 1. Definimos umbrales
  const isZero = stock === 0;
  const umbralBajo = esPorPeso ? 1000 : 20; // 1kg o 20 unidades
  const isLow = stock > 0 && stock <= umbralBajo;
  const isGood = stock > umbralBajo;

  // 2. Determinamos las clases y el icono
  let stockColorClass = "";
  let icon = "";
  let textoEstado = "";

  if (isZero) {
    stockColorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    icon = "error";
    textoEstado = "Sin Stock";
  } else if (isLow) {
    stockColorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    icon = "warning";
    textoEstado = "Stock Bajo";
  } else {
    stockColorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    icon = "check_circle";
    textoEstado = "En Stock";
  }

  // 3. Formateamos el texto del stock (Ej: 1.50 kg, 500 gr, 20 uds.)
  let displayStock = "";
  if (esPorPeso) {
    if (stock >= 1000) {
      displayStock = `${(stock / 1000).toFixed(2)} kg`;
    } else {
      displayStock = `${stock} gr`;
    }
  } else {
    displayStock = `${stock} ${stock === 1 ? "ud." : "uds."}`;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${stockColorClass} ${className}`}>
      <span className="material-symbols-outlined text-[16px] mr-1.5">{icon}</span>
      {showText ? (
        <span className="flex gap-1.5 items-center">
          {displayStock}
        </span>
      ) : displayStock}
      
      {/* Si queremos mostrar ambos (cantidad y estado), podemos hacerlo condicional o dejarlo así */}
      {showText && <span className="ml-1 opacity-80 font-medium">({textoEstado})</span>}
    </span>
  );
}
