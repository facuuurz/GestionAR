import React from "react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  isActive?: boolean; // Para mostrar el puntito azul (filtros/orden activos)
  variant?: "outline" | "solid";
  color?: "primary" | "neutral" | "danger";
}

export default function ActionButton({ 
  icon, 
  label, 
  isActive = false, 
  variant = "outline",
  color = "primary",
  className = "",
  ...props 
}: ActionButtonProps) {
  
  // Base classes for the new unified button style
  let baseClass = "group flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md shrink-0";
  
  if (variant === "outline") {
    baseClass += " border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#151a25] text-primary dark:text-white hover:bg-[#222] hover:text-white dark:hover:bg-white dark:hover:text-black";
  } else if (variant === "solid") {
    if (color === "danger") {
      baseClass += " bg-red-600 text-white border-transparent hover:bg-red-700";
    } else {
      // Default solid (Black/White depending on mode)
      baseClass += " bg-neutral-800 text-white border-transparent hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200";
    }
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${variant === "solid" ? "group-hover:scale-110" : ""}`}>
        {icon}
      </span>
      <span className={variant === "solid" ? "font-bold truncate" : ""}>
        {label}
      </span>
      
      {/* Indicador azul activo (para Filtros y Orden) */}
      {isActive && (
        <span className="flex h-2 w-2 rounded-full bg-blue-600 ml-1 animate-in fade-in zoom-in duration-300"></span>
      )}
    </button>
  );
}
