import { ArrowLeft, CalendarX, DollarSign, FileText, Tag } from "lucide-react";
import Link from "next/link";

export default function DeletedPromoPage({
  searchParams,
}: {
  searchParams: { nombre?: string; descripcion?: string; precio?: string; fechaInicio?: string; fechaFin?: string };
}) {
  const nombre = searchParams.nombre || "Promoción Desconocida";
  const descripcion = searchParams.descripcion || "Sin descripción.";
  const precio = searchParams.precio || "-";
  const fechaInicio = searchParams.fechaInicio
    ? new Date(searchParams.fechaInicio + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })
    : "-";
  const fechaFin = searchParams.fechaFin
    ? new Date(searchParams.fechaFin + "T00:00:00").toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })
    : "-";
  const fechaConsulta = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mt-8 px-4 pb-12">
      <Link
        href="/promociones"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a promociones
      </Link>

      <div className="bg-white dark:bg-[#222] border border-red-500/30 rounded-3xl p-8 shadow-xl shadow-red-500/5 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-100 dark:bg-red-900/10 rounded-full blur-3xl opacity-50 z-0" />

        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-5 ring-8 ring-red-50/50 dark:ring-red-500/5">
            <CalendarX className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Promoción Eliminada</h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-md">
            Esta promoción ya no existe en el sistema. A continuación se muestra el último registro conocido.
          </p>
        </div>

        <div className="relative z-10 w-full bg-[#f8f9fa] dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#ededed] dark:border-[#333]">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-[#ededed] dark:border-[#333] pb-2">
            Último registro conocido
          </h3>
          <div className="space-y-3.5 text-sm">
            <Row icon={<Tag className="w-4 h-4" />} label="Nombre" value={nombre} />
            <Row icon={<DollarSign className="w-4 h-4" />} label="Precio especial" value={`$${precio}`} />
            <Row icon={<CalendarX className="w-4 h-4" />} label="Inicio" value={fechaInicio} />
            <Row icon={<CalendarX className="w-4 h-4" />} label="Fin" value={fechaFin} />
            {descripcion && (
              <div className="flex gap-3 pt-1 border-t border-[#ededed] dark:border-[#333] mt-2">
                <span className="text-gray-500 dark:text-gray-400 font-medium shrink-0 pt-0.5">
                  <FileText className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 font-medium block mb-1">Descripción</span>
                  <span className="text-gray-900 dark:text-white">{descripcion}</span>
                </div>
              </div>
            )}
            <Row icon={null} label="Fecha de consulta" value={fechaConsulta} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 shrink-0">
        {icon}
        {label}
      </span>
      <span className="text-gray-900 dark:text-white font-bold text-right">{value}</span>
    </div>
  );
}
