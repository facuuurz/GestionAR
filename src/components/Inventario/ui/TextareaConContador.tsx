import React, { useState, useRef, useEffect } from "react";

interface TextareaConContadorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  maxLength: number;
  icon: string;
  error?: string;
  iconBgColor?: string;
  iconTextColor?: string;
  onValueChange?: (value: string) => void;
  initialValue?: string;
}

export default function TextareaConContador({
  label,
  maxLength,
  icon,
  error,
  iconBgColor = "bg-indigo-100 dark:bg-indigo-900/50",
  iconTextColor = "text-indigo-700 dark:text-indigo-300",
  onValueChange,
  initialValue = "",
  className = "",
  ...props
}: TextareaConContadorProps) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);
    
    if (onValueChange) {
      onValueChange(val);
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const isError = !!error;
  const isNearLimit = value.length >= maxLength;

  return (
    <label className={`flex flex-col gap-2 relative ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">{label}</span>
        <span className={`text-xs ${isNearLimit ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
          ({value.length}/{maxLength})
        </span>
      </div>
      <div className="relative w-full min-h-12 border-0 m-0 p-0 text-base">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          rows={1}
          className={`flex w-full rounded-lg border ${
            isError ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'
          } bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white p-3 pl-12 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-black/20 overflow-hidden min-h-12`}
          {...props}
        />
        <div className={`pointer-events-none absolute left-3 top-3 flex items-center justify-center w-8 h-8 rounded-full ${iconBgColor} ${iconTextColor}`}>
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
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
