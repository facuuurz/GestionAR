interface ToggleSwitchProps {
  label: string;
  descriptionTruphy: string;
  descriptionFalsy: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export default function ToggleSwitch({
  label,
  descriptionTruphy,
  descriptionFalsy,
  checked,
  onChange,
  className = ""
}: ToggleSwitchProps) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
      checked
        ? 'bg-blue-600 border-blue-700 shadow-lg'
        : 'bg-sky-100 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800 shadow-sm'
    } ${className}`}>
      <div className="flex flex-col">
        <span className={`text-sm font-bold ${checked ? 'text-white' : 'text-sky-900 dark:text-sky-100'}`}>
          {label}
        </span>
        <span className={`text-xs ${checked ? 'text-blue-100 font-medium' : 'text-sky-700 dark:text-sky-400 font-medium'}`}>
          {checked ? descriptionTruphy : descriptionFalsy}
        </span>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer shrink-0 ${
          checked
            ? 'bg-white focus:ring-blue-400'
            : 'bg-slate-500 dark:bg-slate-600 focus:ring-sky-500'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full transition duration-200 ease-in-out shadow-md ${
          checked ? 'translate-x-6 bg-blue-600' : 'translate-x-1 bg-white'
        }`} />
      </button>
    </div>
  );
}
