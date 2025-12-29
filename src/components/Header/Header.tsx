"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Panel", href: "/" },
    { name: "Historial", href: "/historial" },
    { name: "Configuraciones", href: "/configuraciones" },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#ededed] dark:border-[#333] bg-background-light dark:bg-background-dark px-10 py-3 shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-primary dark:text-white">
          <Link className="size-8 flex items-center justify-center rounded-lg bg-primary text-white bg-black dark:bg-white dark:text-primary" href="/">
            <span className="material-symbols-outlined text-[20px]">sunny</span>
          </Link>
          <Link className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]" href="/">GestionAR</Link>
        </div>
      </div>

      <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm leading-normal transition-all duration-300 ease-in-out border-b-2 pb-0.5 ${
                  isActive
                    ? "font-bold border-primary text-primary" 
                    : "font-medium text-neutral-500 dark:text-neutral-400 border-transparent hover:text-primary hover:border-gray-300 dark:hover:border-neutral-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;