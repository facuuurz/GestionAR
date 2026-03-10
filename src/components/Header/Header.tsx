"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Panel", href: "/" },
    { name: "Historial Ventas", href: "/historial-ventas" }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#ededed] dark:border-[#333] bg-[#f6f6f8] dark:bg-[#191919] px-10 py-3 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-primary dark:text-white">
          {/* CAMBIO AQUÍ: 
             - Light: bg-black text-white (Fondo negro, ícono blanco)
             - Dark:  dark:bg-white dark:text-black (Fondo blanco, ícono negro)
          */}
          <Link className="size-8 flex items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black transition-colors" href="/">
            <span className="material-symbols-outlined text-[20px]">sunny</span>
          </Link>
          <Link className="text-primary dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]" href="/">GestionAR</Link>
        </div>
      </div>

      <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center relative">
        {/* HAMBURGER MENU BUTTON (MOBILE ONLY) */}
        <button 
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-primary dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-[60] relative"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined text-3xl">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm leading-normal transition-all duration-300 ease-in-out border-b-2 pb-0.5 ${
                  isActive
                    ? "font-bold border-black text-black dark:border-white dark:text-white" 
                    : "font-medium text-neutral-500 dark:text-neutral-400 border-transparent hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-neutral-600"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* MOBILE FULLSCREEN MENU */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-[#f6f6f8]/95 dark:bg-[#191919]/95 backdrop-blur-md md:hidden flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-8 w-full px-12 text-center">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-2xl py-4 border-b border-black/10 dark:border-white/10 transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in`}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
                  >
                    <span className={
                      isActive
                        ? "font-black text-black dark:text-white" 
                        : "font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                    }>
                      {link.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;