import React from "react";

// Este componente para los errores es de uso interno aquí
function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
      <span className="material-symbols-outlined text-[16px]">error</span>
      {errors[0]}
    </p>
  );
}

// Interfaz para definir qué props acepta nuestro bloque de Lego
interface InputConIconoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  iconName: string;
  iconColorClass: string; // Ej: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  errors?: string[];
  requiredMark?: boolean;
}

export default function InputConIcono({
  label,
  name,
  iconName,
  iconColorClass,
  errors,
  requiredMark = false,
  className = "",
  ...props
}: InputConIconoProps) {
  const hasError = errors && errors.length > 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-bold text-[#111318] dark:text-gray-200" htmlFor={name}>
        {label} {requiredMark && <span className="text-black dark:text-white">*</span>}
      </label>
      
      <div className="relative flex items-center">
        <div className={`absolute left-3 flex items-center justify-center w-8 h-8 rounded-full pointer-events-none ${iconColorClass}`}>
          <span className="material-symbols-outlined text-[18px]">{iconName}</span>
        </div>
        
        <input
          id={name}
          name={name}
          className={`w-full rounded-lg bg-[#f8fafa] dark:bg-gray-800 border-2 pl-14 pr-4 py-3 text-[#111318] dark:text-white transition-all outline-none ring-0 focus:bg-white dark:focus:bg-gray-900 
            ${hasError 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-transparent focus:border-[#135bec] focus:ring-2 focus:ring-[#135bec]/20'
            }`}
          {...props}
        />
      </div>
      
      <ErrorMessage errors={errors} />
    </div>
  );
}