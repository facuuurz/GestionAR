"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BackupRestoreModal from "./BackupRestoreModal";
import { User, Bell, LogOut, Settings, Users, Shield } from "lucide-react";
import { logout } from "@/lib/auth";

export default function Header({ session }: { session: any }) {
  if (!session) return null;
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const navLinks = [
    { name: "Panel", href: "/" },
    { name: "Historial Ventas", href: "/historial-ventas" },
    { name: "Manual de Ayuda", href: "/manual" }
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

          {/* AVATAR & DROPDOWN */}
          <div className="relative flex items-center gap-4 ml-4">
            
            {/* CAMPANITA ADMIN */}
            {session.role === "ADMIN" && (
              <button 
                className="relative p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* AVATAR BUTTON */}
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              {session.name?.charAt(0).toUpperCase() || session.username.charAt(0).toUpperCase()}
            </button>

            {/* DROPDOWN MENU */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 mt-2 w-64 bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-3 pb-4 border-b border-[#ededed] dark:border-[#333]">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{session.name || session.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{session.username}</p>
                </div>
                
                <div className="px-4 py-2 mt-1 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-[#ededed] dark:border-[#333] pb-3">
                  <Shield className="w-3 h-3" />
                  Rol: {session.role === "ADMIN" ? "Administrador" : "Empleado"}
                </div>
                
                <div className="py-1">
                  {session.role === "ADMIN" && (
                    <>
                      <Link href="/empleados" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors" onClick={() => setIsProfileOpen(false)}>
                        <Users className="w-4 h-4" />
                        Ver empleados
                      </Link>
                      <button onClick={() => { setIsRestoreModalOpen(true); setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors">
                        <span className="material-symbols-outlined text-[16px]">settings_backup_restore</span>
                        Recuperación (Backup)
                      </button>
                    </>
                  )}

                  <Link href="/cuenta" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors" onClick={() => setIsProfileOpen(false)}>
                    <Settings className="w-4 h-4" />
                    Cuenta
                  </Link>
                </div>
                
                <div className="border-t border-[#ededed] dark:border-[#333] my-1"></div>
                
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    await logout();
                    window.location.href = "/login";
                  }} 
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
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
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsRestoreModalOpen(true);
                }}
                className={`flex items-center justify-center gap-3 text-2xl py-4 border-b border-black/10 dark:border-white/10 transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white`}
                style={{ animationDelay: `${navLinks.length * 100}ms`, animationFillMode: "both" }}
              >
                <span className="material-symbols-outlined text-3xl">settings_backup_restore</span>
                Recuperación
              </button>
            </div>
          </div>
        )}
      </div>

      <BackupRestoreModal 
        isOpen={isRestoreModalOpen} 
        onClose={() => setIsRestoreModalOpen(false)} 
      />
    </header>
  );
};
