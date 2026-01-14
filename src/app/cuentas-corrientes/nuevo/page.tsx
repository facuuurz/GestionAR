import { crearCliente } from "@/actions/clientes";
import Link from "next/link";

export default function NuevoClientePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6] dark:bg-[#111827] text-slate-800 dark:text-slate-100 font-sans">

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl">
          
          {/* Breadcrumbs */}
          <nav className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:text-slate-800 transition-colors">Panel</Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <Link href="/cuentas-corrientes" className="hover:text-slate-800 transition-colors">Cuentas Corrientes</Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Agregar Cuenta</span>
          </nav>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Agregar Nueva Cuenta</h1>
            <p className="text-slate-500 dark:text-slate-400">Ingrese los detalles del nuevo cliente para abrir una cuenta corriente.</p>
          </div>

          {/* FORMULARIO */}
          <form action={crearCliente} className="bg-white dark:bg-[#1f2937] rounded-xl shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden">
            
            {/* Cabecera del Formulario */}
            <div className="px-8 py-5 border-b border-slate-200 dark:border-slate-600 flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-900 dark:text-white">account_box</span>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Información del Cliente</h2>
            </div>

            <div className="p-8 space-y-8">
              {/* FILA 1: Nombre y CUIT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Campo: Nombre / Razón Social */}
                <div className="space-y-2">
                  <label htmlFor="nombre" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Nombre o Razón Social
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2 w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                      <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                    <input 
                      required
                      name="nombre" 
                      id="nombre"
                      type="text" 
                      placeholder="Ej. Juan Pérez o Pérez S.A." 
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Campo: CUIT */}
                <div className="space-y-2">
                  <label htmlFor="cuit" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    CUIT / CUIL
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2 w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400">
                      <span className="material-symbols-outlined text-sm">id_card</span>
                    </div>
                    <input 
                      name="cuit" 
                      id="cuit"
                      type="text" 
                      placeholder="Ej. 20-12345678-9" 
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* FILA 2: Email y Teléfono */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                 {/* Campo: Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Correo Electrónico
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2 w-8 h-8 rounded-lg flex items-center justify-center bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400">
                      <span className="material-symbols-outlined text-sm">mail</span>
                    </div>
                    <input 
                      name="email"
                      id="email" 
                      type="email" 
                      placeholder="cliente@ejemplo.com" 
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Campo: Teléfono */}
                <div className="space-y-2">
                  <label htmlFor="telefono" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Teléfono
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2 w-8 h-8 rounded-lg flex items-center justify-center bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                      <span className="material-symbols-outlined text-sm">call</span>
                    </div>
                    <input 
                      name="telefono"
                      id="telefono" 
                      type="tel" 
                      placeholder="+54 11 1234 5678" 
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200 dark:border-slate-600"></div>

              {/* FILA 3: Dirección */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label htmlFor="direccion" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Dirección Física
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-2 w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                    </div>
                    <input 
                      name="direccion"
                      id="direccion"
                      type="text" 
                      placeholder="Calle Falsa 123, Ciudad" 
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BOTONES */}
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-600 flex justify-end gap-3">
              <Link 
                href="/cuentas-corrientes"
                className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm text-sm"
              >
                Cancelar
              </Link>
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-md flex items-center gap-2 transition-colors text-sm"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                Guardar Cuenta Corriente
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}