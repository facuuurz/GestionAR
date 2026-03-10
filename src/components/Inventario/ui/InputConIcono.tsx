import React from "react";

interface InputConIconoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: string;
  error?: string;
  iconBgColor?: string;
  iconTextColor?: string;
  rightElement?: React.ReactNode;
}

export default function InputConIcono({
  label,
  icon,
  error,
  iconBgColor = "bg-blue-100 dark:bg-blue-900/50",
  iconTextColor = "text-blue-700 dark:text-blue-300",
  rightElement,
  className = "",
  ...props
}: InputConIconoProps) {
  const isError = !!error;
  
  return (
    <label className={`flex flex-col gap-2 relative ${className}`}>
      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">
        {label}
      </span>
      <div className="relative w-full text-base">
        <input
          className={`flex w-full rounded-lg border ${
            isError ? "border-red-500" : "border-[#cfd7e7] dark:border-[#4a5568]"
          } bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 ${
            rightElement ? "pr-14" : "pr-4"
          } text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
          {...props}
        />
        <div className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full ${iconBgColor} ${iconTextColor}`}>
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {isError && (
        <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}
    </label>
  );
}
