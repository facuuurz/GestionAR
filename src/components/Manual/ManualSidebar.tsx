"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

interface SectionItem {
  id: string;
  title: string;
  icon: string;
  description: string;
}

interface ManualSidebarProps {
  sections: SectionItem[];
  loading?: boolean;
}

export default function ManualSidebar({ sections, loading = false }: ManualSidebarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentSection = searchParams.get("seccion");

  return (
    <aside className="w-full md:w-64 lg:w-80 flex-shrink-0 bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-4 h-full flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center gap-2 px-2 pb-2 border-b border-gray-100 dark:border-gray-800">
        <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">menu_book</span>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Índice</h2>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse w-full"></div>
          ))}
        </div>
      ) : (
        <nav className="flex flex-col gap-2 mt-2">
          {sections.map((section) => {
            const isActive = currentSection === section.id || (!currentSection && section.id === "ventas"); // Default a ventas si no hay params
            
            // Creamos los params para la URL
            const params = new URLSearchParams(searchParams.toString());
            params.set("seccion", section.id);

            return (
              <Link
                key={section.id}
                href={`${pathname}?${params.toString()}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 group ${
                  isActive 
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
                  isActive 
                  ? "bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-blue-500"
                }`}>
                  <span className="material-symbols-outlined text-sm">{section.icon}</span>
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="truncate">{section.title}</span>
                </div>
                {isActive && (
                  <span className="material-symbols-outlined text-sm text-blue-600 dark:text-blue-400">chevron_right</span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
      
    </aside>
  );
}
