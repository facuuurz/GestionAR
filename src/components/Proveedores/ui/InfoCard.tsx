import React from "react";

interface InfoCardProps {
  iconName: string;
  iconColorClass: string;
  title: string;
  value: React.ReactNode;
}

export default function InfoCard({ iconName, iconColorClass, title, value }: InfoCardProps) {
  return (
    <div className="flex items-start gap-3">
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${iconColorClass}`}>
        <span className="material-symbols-outlined text-xl">{iconName}</span>
      </div>
      <div>
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          {title}
        </h3>
        <div className="text-base font-medium text-gray-900 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}