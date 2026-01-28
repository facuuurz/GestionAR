"use client";

import { useState, useMemo } from "react";

interface Movimiento {
  id: number;
  fecha: Date;
  descripcion: string;
  monto: number;
  tipo: string;
}

interface Cliente {
  nombre: string;
  cuit: string;
}

interface Props {
  movimientos: Movimiento[];
  cliente: Cliente;
}

export default function HistorialCliente({ movimientos, cliente }: Props) {
  // Estado para el mes seleccionado (formato YYYY-MM). Por defecto, el mes actual.
  const [filtroMes, setFiltroMes] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  // 1. Filtrar movimientos según el mes seleccionado
  const movimientosFiltrados = useMemo(() => {
    if (!filtroMes) return movimientos;
    return movimientos.filter((m) => {
      const fechaMov = new Date(m.fecha).toISOString().slice(0, 7);
      return fechaMov === filtroMes;
    });
  }, [movimientos, filtroMes]);

  // Helpers de formato (mismos que tenías)
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  // 2. Lógica para generar y descargar Factura/Resumen .TXT
  const descargarResumen = () => {
    if (movimientosFiltrados.length === 0) {
      alert("No hay movimientos para generar el resumen en este período.");
      return;
    }

    const [anio, mes] = filtroMes.split("-");
    const periodoStr = `${mes}/${anio}`;
    
    // Calcular totales del periodo
    const totalCreditos = movimientosFiltrados
      .filter(m => m.tipo === "CREDITO")
      .reduce((acc, curr) => acc + curr.monto, 0);
      
    const totalDebitos = movimientosFiltrados
      .filter(m => m.tipo !== "CREDITO")
      .reduce((acc, curr) => acc + curr.monto, 0);

    const balancePeriodo = totalCreditos - totalDebitos;

    // Construir contenido del archivo de texto
    let contenido = `RESUMEN DE CUENTA CORRIENTE - ${process.env.NEXT_PUBLIC_APP_NAME || "GESTIONAR"}\n`;
    contenido += `========================================\n`;
    contenido += `CLIENTE: ${cliente.nombre}\n`;
    contenido += `CUIT: ${cliente.cuit}\n`;
    contenido += `PERIODO: ${periodoStr}\n`;
    contenido += `FECHA EMISIÓN: ${new Date().toLocaleDateString("es-AR")}\n`;
    contenido += `========================================\n\n`;
    
    contenido += `DETALLE DE MOVIMIENTOS:\n`;
    contenido += `-----------------------------------------------------------------------\n`;
    contenido += `| FECHA      | TIPO      | DESCRIPCIÓN                     | MONTO      |\n`;
    contenido += `-----------------------------------------------------------------------\n`;

    movimientosFiltrados.forEach((m) => {
      const fecha = new Date(m.fecha).toLocaleDateString("es-AR");
      const tipo = m.tipo === "CREDITO" ? "CRÉDITO" : "DÉBITO "; // Espacio para alinear
      // Truncar o rellenar descripción para que la tabla de texto se vea decente
      const desc = m.descripcion.padEnd(30).slice(0, 30);
      const monto = formatMoney(m.monto).padStart(12);
      
      contenido += `| ${fecha} | ${tipo} | ${desc} | ${monto} |\n`;
    });

    contenido += `-----------------------------------------------------------------------\n\n`;
    contenido += `RESUMEN DEL PERÍODO:\n`;
    contenido += `Total Créditos (Pagos/Abonos):   ${formatMoney(totalCreditos)}\n`;
    contenido += `Total Débitos  (Cargos/Compras): ${formatMoney(totalDebitos)}\n`;
    contenido += `Balance del Período:             ${formatMoney(balancePeriodo)}\n`;

    // Crear Blob y descargar
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Resumen_${cliente.nombre.replace(/\s+/g, '_')}_${periodoStr.replace('/', '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 min-h-100 flex-1">
      {/* BARRA DE CONTROLES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 bg-white dark:bg-[#1a2632] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
           <h3 className="text-xl font-bold text-[#111318] dark:text-white">
            Historial
          </h3>
          <p className="text-xs text-slate-500">Filtrar por mes de emisión</p>
        </div>
       
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Selector de Mes */}
          <input
            type="month"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
            className="block w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-white"
          />

          {/* Botón Descargar */}
          <button
  onClick={descargarResumen}
  className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-500 whitespace-nowrap"
  title="Descargar resumen mensual en TXT"
>
  <span className="material-symbols-outlined text-[20px] transition-transform duration-500 ease-in-out group-hover:rotate-12">
    description
  </span>
  <span className="hidden sm:inline">Generar Resumen</span>
</button>
        </div>
      </div>

      {/* TABLA DE DATOS */}
      <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left relative border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap w-3.75">Fecha</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">Descripción</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap w-45">Tipo</th>
                <th className="px-6 py-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap text-right w-45">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {movimientosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined text-4xl opacity-50">event_busy</span>
                      <p>No hay movimientos en el período seleccionado.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                movimientosFiltrados.map((mov) => {
                  const isCredito = mov.tipo === "CREDITO";
                  return (
                    <tr key={mov.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap capitalize">
                        {formatDate(mov.fecha)}
                      </td>
                      <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">
                        {mov.descripcion}
                      </td>
                      <td className="px-6 py-4">
                        {isCredito ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                            Crédito
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                            Débito
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 font-bold text-right ${isCredito ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isCredito ? "+" : "-"}{formatMoney(mov.monto)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}