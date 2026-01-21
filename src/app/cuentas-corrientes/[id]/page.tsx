import { obtenerClientePorId } from "@/actions/cuentas-corrientes";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalleClientePage({ params }: PageProps) {
  const { id } = await params;
  
  // Convertimos el ID de la URL a número
  const clienteId = parseInt(id);
  if (isNaN(clienteId)) return notFound();

  // Buscamos los datos en la BD
  const cliente = await obtenerClientePorId(clienteId);
  if (!cliente) return notFound();

  // Helper para formato de moneda
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white">
     
      <main className="flex-1 px-4 md:px-10 py-8 max-w-[1200px] mx-auto w-full flex flex-col gap-6">
        
        {/* BREADCRUMBS */}
        <nav aria-label="Breadcrumb">
          <div className="flex flex-wrap items-center gap-2 text-sm md:text-base">
            <Link className="text-slate-500 dark:text-slate-400 font-medium hover:text-primary transition-colors" href="/">Panel</Link>
            <span className="text-slate-400 material-symbols-outlined text-[16px] pt-1">chevron_right</span>
            <Link className="text-slate-500 dark:text-slate-400 font-medium hover:text-primary transition-colors" href="/cuentas-corrientes">Cuentas Corrientes</Link>
            <span className="text-slate-400 material-symbols-outlined text-[16px] pt-1">chevron_right</span>
            <span className="text-slate-900 dark:text-white font-semibold">{cliente.nombre}</span>
          </div>
        </nav>

        {/* TÍTULO Y BOTÓN EDITAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {cliente.nombre}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">Detalle de Cuenta Corriente</p>
          </div>
          <Link 
            href={`/cuentas-corrientes/editar/${cliente.id}`}
            className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-black hover:bg-slate-800 text-white text-sm font-bold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
            <span>Editar Cliente</span>
          </Link>
        </div>

        {/* TARJETAS DE INFORMACIÓN */}
        <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* COLUMNA IZQUIERDA: DATOS PERSONALES */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                
                {/* Razón Social */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-start gap-4">
                  <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">business</span>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Razón Social</p>
                    <p className="text-slate-900 dark:text-white font-bold text-lg">{cliente.nombre}</p>
                  </div>
                </div>

                {/* CUIT */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-start gap-4">
                  <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">CUIT</p>
                    <p className="text-slate-900 dark:text-white font-bold text-lg">{cliente.cuit || "-"}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-start gap-4">
                  <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
                    <p className="text-slate-900 dark:text-white font-medium text-lg break-all">{cliente.email || "-"}</p>
                  </div>
                </div>

                {/* Teléfono */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-start gap-4">
                  <div className="size-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Teléfono</p>
                    <p className="text-slate-900 dark:text-white font-medium text-lg">{cliente.telefono || "-"}</p>
                  </div>
                </div>

                {/* Dirección */}
                <div className="md:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-start gap-4">
                  <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Dirección</p>
                    <p className="text-slate-900 dark:text-white font-medium text-lg">{cliente.direccion || "-"}</p>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: SALDO */}
              <div className="flex-shrink-0 lg:w-1/3 flex flex-col gap-4">
                
                {/* Tarjeta de Saldo */}
                <div className={`p-5 rounded-lg border flex flex-col gap-1 ${
                    Number(cliente.saldo) < 0 
                        ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800" 
                        : "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                }`}>
                  <div className={`flex items-center gap-2 ${Number(cliente.saldo) < 0 ? "text-red-600" : "text-green-600 dark:text-green-400"}`}>
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                    <p className="text-sm font-bold uppercase tracking-wide">Saldo Actual</p>
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {formatMoney(Number(cliente.saldo))}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {Number(cliente.saldo) < 0 ? "El cliente debe dinero" : "Saldo a favor"}
                  </p>
                </div>

                {/* NOTA: Eliminé el cuadro de "Límite de Crédito" 
                   porque el campo ya no existe en la base de datos.
                */}

              </div>

            </div>
          </div>
        </div>

        {/* NOTA: Aquí iría el Historial de Movimientos, 
            pero se ha omitido por ahora según tu indicación.
        */}

      </main>
    </div>
  );
}