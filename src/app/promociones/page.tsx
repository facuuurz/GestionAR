import Link from "next/link";
import { obtenerPromociones } from "@/actions/promociones";
import Search from "@/components/Search/Search"; // Asumo que ya tienes este componente de módulos anteriores

export default async function PromocionesPage(props: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const promociones = await obtenerPromociones(query);

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Función para formatear fechas
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };

  // Lógica para determinar el estado (Activo, Vencido, Programado)
  const getEstadoPromocion = (inicio: Date, fin: Date) => {
    const hoy = new Date();
    // Normalizamos horas para comparar solo fechas si es necesario, 
    // pero aquí comparamos timestamps directos para precisión.
    
    if (hoy > fin) {
      return { 
        label: "Vencido", 
        badgeColor: "bg-red-100 text-red-800 ring-red-600/10",
        btnColor: "bg-green-600 hover:bg-green-700",
        btnIcon: "restore",
        btnText: "Reactivar"
      };
    } else if (hoy < inicio) {
      return { 
        label: "Programado", 
        badgeColor: "bg-blue-100 text-blue-800 ring-blue-600/10",
        btnColor: "bg-black hover:bg-gray-800 dark:bg-white dark:text-black",
        btnIcon: "edit",
        btnText: "Actualizar"
      };
    } else {
      return { 
        label: "Activo", 
        badgeColor: "bg-emerald-100 text-emerald-800 ring-emerald-600/10",
        btnColor: "bg-black hover:bg-gray-800 dark:bg-white dark:text-black",
        btnIcon: "edit",
        btnText: "Actualizar"
      };
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      
      <main className="flex-1 flex flex-col items-center py-8 px-6 lg:px-12 xl:px-40 w-full">
        <div className="flex flex-col w-full max-w-[1200px] gap-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            <Link className="text-[#616f89] dark:text-[#9ca3af] font-medium hover:text-primary transition-colors" href="/">
              Panel
            </Link>
            <span className="material-symbols-outlined text-[#616f89] dark:text-[#9ca3af] text-base">chevron_right</span>
            <span className="text-[#111318] dark:text-white font-medium">Promociones</span>
          </nav>

          {/* Header y Botón */}
          <div className="flex flex-col md:flex-row flex-wrap justify-between gap-4 items-start md:items-center">
            <div className="flex min-w-72 flex-col gap-1">
              <h1 className="text-[#111318] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                Listado de Promociones
              </h1>
              <p className="text-[#616f89] dark:text-[#9ca3af] text-base font-normal leading-normal">
                Gestiona tus ofertas activas, precios promocionales y vigencias.
              </p>
            </div>
            <Link 
              href="/promociones/nuevo"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-black dark:bg-[#135bec] hover:bg-gray-800 dark:hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 shadow-sm"
            >
              <span className="truncate">+ Nueva Promoción</span>
            </Link>
          </div>

          {/* Barra de Búsqueda */}
          <div className="w-full bg-white dark:bg-[#1a2230] p-4 rounded-xl border border-[#dbdfe6] dark:border-[#2e343d] shadow-sm">
             <Search placeholder="Buscar por nombre de promoción o descripción..." />
          </div>

          {/* Tabla */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-[#dbdfe6] dark:border-[#2e343d] bg-white dark:bg-[#1a2230] shadow-sm min-h-[500px]">
            <div className="overflow-x-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <table className="w-full min-w-[800px] border-collapse">
                <thead className="sticky top-0 z-10 bg-[#f6f6f8] dark:bg-[#111318]">
                  <tr className="border-b border-[#dbdfe6] dark:border-[#2e343d]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-[#9ca3af] w-[20%]">Nombre</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-[#9ca3af] w-[25%]">Descripción</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-[#9ca3af] w-[15%]">Precio Promocional</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-[#9ca3af] w-[20%]">Vigencia</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-[#9ca3af] w-[10%]">Estado</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[#616f89] dark:text-[#9ca3af] w-[10%]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dbdfe6] dark:divide-[#2e343d]">
                  
                  {promociones.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#616f89] dark:text-[#9ca3af]">
                        No hay promociones registradas.
                      </td>
                    </tr>
                  )}

                  {promociones.map((promo) => {
                    const estado = getEstadoPromocion(promo.fechaInicio, promo.fechaFin);

                    return (
                      <tr key={promo.id} className="group hover:bg-[#f6f6f8]/50 dark:hover:bg-[#111318]/50 transition-colors">
                        <td className="px-6 py-4 text-[#111318] dark:text-white text-sm font-medium">
                          <Link 
                              href={`/promociones/${promo.id}`} 
                               className="text-[#111318] dark:text-white text-sm font-bold hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors cursor-pointer"
                          >
                              {promo.nombre}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-[#616f89] dark:text-[#9ca3af] text-sm">
                          {promo.descripcion}
                        </td>
                        <td className="px-6 py-4 text-[#111318] dark:text-white text-sm font-bold">
                          {formatCurrency(promo.precio)}
                        </td>
                        <td className="px-6 py-4 text-[#616f89] dark:text-[#9ca3af] text-sm">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                            {formatDate(promo.fechaInicio)} - {formatDate(promo.fechaFin)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${estado.badgeColor}`}>
                            {estado.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Link 
                            href={`/promociones/editar/${promo.id}`}
                            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors shadow-sm w-36 ${estado.btnColor}`}
                          >
                            <span className="material-symbols-outlined text-[18px] mr-1">{estado.btnIcon}</span>
                            {estado.btnText}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}