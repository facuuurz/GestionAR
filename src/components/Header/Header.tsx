"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Panel", href: "/" },
    // Eliminamos el slash extra al final para evitar errores de coincidencia
    { name: "Historial Ventas", href: "/historial-ventas" } 
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#ededed] dark:border-[#333] bg-[#f6f6f8] dark:bg-[#191919] px-10 py-3 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-primary dark:text-white">
          <Link className="size-8 flex items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black transition-colors" href="/">
            <span className="material-symbols-outlined text-[20px]">sunny</span>
          </Link>
          <Link className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]" href="/">GestionAR</Link>
        </div>
      </div>

      <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            // Lógica de activación mejorada:
            // 1. Si es '/', debe ser exacto.
            // 2. Si es otra ruta, verificamos si el pathname empieza con esa ruta (por si hay subpáginas)
            const isActive = 
              link.href === "/" 
                ? pathname === "/" 
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm leading-normal transition-all duration-300 ease-in-out border-b-2 pb-0.5 ${
                  isActive
                    ? "font-bold border-black text-black dark:border-white dark:text-white translate-y-[-1px]" 
                    : "font-medium text-neutral-500 dark:text-neutral-400 border-transparent hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-neutral-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;