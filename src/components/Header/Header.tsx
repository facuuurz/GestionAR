"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BackupRestoreModal from "./BackupRestoreModal";
import { User, Bell, LogOut, Users, Shield, CheckCheck } from "lucide-react";
import { logout } from "@/lib/auth";
import { getRecentNotificationsAction, markNotificationsAsReadAction } from "@/actions/notificaciones";

export default function Header({ session }: { session: any }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al clickear fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch initial notifications
  useEffect(() => {
    if (session.role === "ADMIN" || session.role === "SUPERADMIN") {
      getRecentNotificationsAction(session.userId).then(notifs => {
        setNotifications(notifs);
        setUnreadCount(notifs.filter(n => !n.isRead).length);
      });
    }
  }, [session]);

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    await markNotificationsAsReadAction(session.userId, unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

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
            {(session.role === "ADMIN" || session.role === "SUPERADMIN") && (
                <div className="relative" ref={notificationsRef}>
                  <button 
                    className={`p-2 rounded-full transition-colors ${isNotificationsOpen ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'}`}
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsProfileOpen(false); // Cierra el otro menú
                    }}
                    title="Notificaciones"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#f6f6f8] dark:border-[#191919]"></span>
                    )}
                  </button>

                  {/* DROPDOWN NOTIFICACIONES */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 top-12 mt-2 w-96 bg-white dark:bg-[#1f1f1f] border border-[#ededed] dark:border-[#333] rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden flex flex-col max-h-[85vh]">
                      <div className="px-5 py-4 border-b border-[#ededed] dark:border-[#333] flex justify-between items-center bg-gray-50/80 dark:bg-black/40 backdrop-blur-sm z-10 shrink-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white">Notificaciones</h3>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllAsRead} className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors bg-blue-50 dark:bg-blue-500/10 px-2 py-1.5 rounded-lg cursor-pointer">
                            <CheckCheck className="w-3.5 h-3.5" />
                            Marcar leídas
                          </button>
                        )}
                      </div>
                      
                      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[100px]">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                            <div className="w-14 h-14 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 shrink-0 ring-4 ring-gray-50 dark:ring-[#222]">
                              <Bell className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No hay notificaciones</p>
                            <p className="text-xs text-gray-400 mt-1">Aquí verás alertas importantes del sistema.</p>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                             {notifications.map(notif => {
                               const isUnread = !notif.isRead;
                               // Traducir tipo a español
                               const typeLabels: Record<string, string> = {
                                 USER_CREATED: 'Usuario Creado',
                                 USER_DELETED: 'Usuario Eliminado',
                                 STOCK_LOW: 'Stock Bajo',
                                 STOCK_NONE: 'Sin Stock',
                                 PROMO_ACTIVED: 'Promoción Activada',
                                 PROMO_ENDED: 'Promoción Finalizada',
                                 PROMO_CREATED: 'Nueva Promoción',
                                 PROMO_DELETED: 'Promoción Eliminada',
                                 PRODUCT_CREATED: 'Producto Agregado',
                                 PRODUCT_DELETED: 'Producto Eliminado',
                                 SUPPLIER_CREATED: 'Proveedor Registrado',
                                 SUPPLIER_DELETED: 'Proveedor Eliminado',
                               };
                               const typeName = typeLabels[notif.type] || notif.type;

                               // Configurar el color base de ícono según tipo de notificación
                               let iconColorClass = "text-gray-500 dark:text-gray-400";
                               let bgIconClass = "bg-gray-100 dark:bg-gray-800";
                               let titleColorClass = "text-gray-900 dark:text-white";

                               if (notif.type.includes("USER") || notif.type === "SUPPLIER_CREATED") {
                                 iconColorClass = isUnread ? "text-indigo-600 dark:text-indigo-400" : "text-indigo-400 dark:text-indigo-400/50";
                                 bgIconClass = isUnread ? "bg-indigo-50 dark:bg-indigo-500/10" : "bg-gray-50 dark:bg-gray-800";
                                 titleColorClass = isUnread ? "text-indigo-950 dark:text-indigo-100" : "text-gray-700 dark:text-gray-300";
                               } else if (notif.type.includes("STOCK_LOW") || notif.type === "PRODUCT_CREATED") {
                                 iconColorClass = isUnread ? "text-amber-600 dark:text-amber-400" : "text-amber-500 dark:text-amber-400/50";
                                 bgIconClass = isUnread ? "bg-amber-50 dark:bg-amber-500/10" : "bg-gray-50 dark:bg-gray-800";
                                 titleColorClass = isUnread ? "text-amber-950 dark:text-amber-50" : "text-gray-700 dark:text-gray-300";
                               } else if (notif.type.includes("STOCK_NONE") || notif.type.includes("DELETED")) {
                                 iconColorClass = isUnread ? "text-red-600 dark:text-red-400" : "text-red-400 dark:text-red-400/50";
                                 bgIconClass = isUnread ? "bg-red-50 dark:bg-red-500/10" : "bg-gray-50 dark:bg-gray-800";
                                 titleColorClass = isUnread ? "text-red-950 dark:text-red-100" : "text-gray-700 dark:text-gray-300";
                               } else if (notif.type.includes("PROMO")) {
                                 iconColorClass = isUnread ? "text-emerald-600 dark:text-emerald-400" : "text-emerald-400 dark:text-emerald-400/50";
                                 bgIconClass = isUnread ? "bg-emerald-50 dark:bg-emerald-500/10" : "bg-gray-50 dark:bg-gray-800";
                                 titleColorClass = isUnread ? "text-emerald-950 dark:text-emerald-50" : "text-gray-700 dark:text-gray-300";
                               }

                               return (
                               <Link 
                                 href={notif.linkUrl || "#"} 
                                 key={notif.id}
                                 onClick={() => {
                                   if (isUnread) {
                                     markNotificationsAsReadAction(session.userId, [notif.id]);
                                     setNotifications(prev => prev.map(n => n.id === notif.id ? {...n, isRead: true} : n));
                                     setUnreadCount(prev => Math.max(0, prev - 1));
                                   }
                                   setIsNotificationsOpen(false);
                                 }}
                                 className={`px-5 py-4 transition-all flex gap-4 items-start border-b border-[#ededed]/50 dark:border-[#333]/50 last:border-0 relative
                                   ${isUnread 
                                     ? 'bg-blue-50/40 hover:bg-blue-50 dark:bg-[#252528] dark:hover:bg-[#2a2a2d]' 
                                     : 'bg-white hover:bg-gray-50 dark:bg-[#1f1f1f] dark:hover:bg-[#252525] opacity-75 hover:opacity-100'
                                   }
                                 `}
                               >
                                 {isUnread && (
                                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 dark:bg-blue-400"></div>
                                 )}
                                 <div className={`p-2.5 rounded-full shrink-0 ${bgIconClass}`}>
                                   <Bell className={`w-4 h-4 ${iconColorClass}`} />
                                 </div>
                                 <div className="flex flex-col flex-1 min-w-0">
                                    <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 ${titleColorClass}`}>
                                      {typeName}
                                      {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>}
                                    </span>
                                    <span className={`text-[13px] leading-snug break-words whitespace-normal overflow-hidden ${isUnread ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                                      {notif.message}
                                    </span>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
                                      {(() => {
                                        const d = new Date(notif.createdAt);
                                        const dd = String(d.getDate()).padStart(2, '0');
                                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                                        const aa = String(d.getFullYear()).slice(2);
                                        const hh = String(d.getHours()).padStart(2, '0');
                                        const min = String(d.getMinutes()).padStart(2, '0');
                                        return `${dd}/${mm}/${aa} ${hh}:${min}`;
                                      })()}
                                    </span>
                                 </div>
                               </Link>
                               );
                             })}
                          </div>
                        )}
                      </div>
                    </div>
                   )}
                 </div>
             )}

            {/* AVATAR + DROPDOWN envuelto en ref para click-outside */}
            <div className="relative" ref={profileRef}>
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
            </div> {/* cierra profileRef wrapper */}
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
