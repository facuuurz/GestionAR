import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Renderizamos el Link si tiene href y no es el último, sino solo el texto */}
            {item.href && !isLast ? (
              <Link 
                href={item.href} 
                className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-white font-bold">
                {item.label}
              </span>
            )}

            {/* Agregamos el separador si no es el último elemento */}
            {!isLast && (
              <span className="material-symbols-outlined text-neutral-400 text-base mx-2">
                chevron_right
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}