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
            
            {/* ESTADÍSTICAS ADMIN */}
            {(session.role === "ADMIN" || session.role === "SUPERADMIN") && (
              <Link 
                href="/estadisticas"
                className="relative p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                title="Estadísticas de Negocio"
              >
                <span className="material-symbols-outlined text-[24px]">query_stats</span>
              </Link>
            )}

            {/* CAMPANITA ADMIN */}
            {(session.role === "ADMIN" || session.role === "SUPERADMIN") && (() => {
              // TODO: Fetch real unread notifications count from backend in the future
              const unreadNotifications = 0;
              
              return (
                <div className="relative">
                  <button 
                    className={`p-2 rounded-full transition-colors ${isNotificationsOpen ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'}`}
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsProfileOpen(false); // Cierra el otro menú
                    }}
                    title="Notificaciones"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#f6f6f8] dark:border-[#191919]"></span>
                    )}
                  </button>

                  {/* DROPDOWN NOTIFICACIONES */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 top-12 mt-2 w-72 bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#ededed] dark:border-[#333] flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                        {unreadNotifications > 0 && (
                          <button className="text-xs text-blue-600 hover:text-blue-500 font-medium">Marcar leídas</button>
                        )}
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto overflow-x-hidden">
                        {unreadNotifications === 0 ? (
                          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                            <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shrink-0">
                              <Bell className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-normal">No hay notificaciones nuevas</p>
                            <p className="text-xs text-gray-400 mt-1 whitespace-normal text-balance">Aquí verás alertas importantes del sistema en el futuro.</p>
                          </div>
                        ) : (
                          <div className="py-4 px-4 text-center text-sm text-gray-500 whitespace-normal text-balance">
                            {/* Placeholder para cuando haya notificaciones reales */}
                            Tienes {unreadNotifications} notificaciones sin leer.
                          </div>
                        )}
                      </div>

                      <div className="border-t border-[#ededed] dark:border-[#333] p-2 bg-gray-50/50 dark:bg-black/20">
                        <Link 
                          href="/configuraciones" 
                          className="w-full text-center block py-1.5 text-xs font-medium text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          Configurar notificaciones
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* AVATAR BUTTON */}
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              {session.profilePicture ? (
                <img src={session.profilePicture} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                session.name?.charAt(0).toUpperCase() || session.username.charAt(0).toUpperCase()
              )}
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
                  Rol: {session.role === "SUPERADMIN" ? "Super Admin" : session.role === "ADMIN" ? "Administrador" : "Empleado"}
                </div>
                
                <div className="py-1">
                  <Link href="/cuenta" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer" onClick={() => setIsProfileOpen(false)}>
                    <User className="w-4 h-4" />
                    Cuenta
                  </Link>

                  {(session.role === "ADMIN" || session.role === "SUPERADMIN") && (
                    <>
                      <Link href="/empleados" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer" onClick={() => setIsProfileOpen(false)}>
                        <Users className="w-4 h-4" />
                        Ver empleados
                      </Link>
                      <button onClick={() => { setIsRestoreModalOpen(true); setIsProfileOpen(false); }} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[16px]">settings_backup_restore</span>
                        Recuperación (Backup)
                      </button>
                    </>
                  )}

                  <Link href="/configuraciones" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333] transition-colors cursor-pointer" onClick={() => setIsProfileOpen(false)}>
                    <Settings className="w-4 h-4" />
                    Configuraciones
                  </Link>
                </div>
                
                <div className="border-t border-[#ededed] dark:border-[#333] my-1"></div>
                
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    await logout();
                    window.location.href = "/login";
                  }} 
                  className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
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
