import React from "react";

interface InfoCardProps {
  label: string;
  value: React.ReactNode;
  icon: string;
  iconBgColor?: string;
  iconTextColor?: string;
  containerClass?: string;
  isErrorValue?: boolean;
  className?: string;
}

export default function InfoCard({
  label,
  value,
  icon,
  iconBgColor = "bg-blue-100 dark:bg-blue-900/30",
  iconTextColor = "text-blue-600 dark:text-blue-400",
  containerClass = "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50",
  isErrorValue = false,
  className = ""
}: InfoCardProps) {
  return (
    <div className={`flex gap-4 p-4 rounded-lg border ${containerClass} ${className}`}>
      <div className={`shrink-0 size-10 rounded-lg flex items-center justify-center shadow-sm ${iconBgColor} ${iconTextColor}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider font-display ${isErrorValue ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-gray-400'}`}>
          {label}
        </p>
        <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-display tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
