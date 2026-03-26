import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { obtenerDetalleVenta } from '@/actions/ventas';
import BotonExportarVenta from '@/components/Historial/BotonExportarVenta';
import BotonExportarPDF from '@/components/Historial/BotonExportarPDF';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalleVentaPage({ params }: PageProps) {
  const { id } = await params;
  const idVenta = parseInt(id, 10);

  if (isNaN(idVenta)) {
    notFound();
  }

  const venta = await obtenerDetalleVenta(idVenta);

  if (!venta) {
    notFound(); 
  }

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Link className="hover:text-blue-600 text-slate-500 dark:text-blue-400 text-sm font-medium hover:underline" href="/">Panel</Link>
        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
        <Link className="hover:text-blue-600 text-slate-500 dark:text-blue-400 text-sm font-medium hover:underline" href="/historial-ventas">Historial de Ventas</Link>
        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
        <span className="text-slate-900 dark:text-slate-400 text-sm font-medium">venta</span>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
              Detalle de venta
            </h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1`}>
            </span>
          </div>
          <p className="text-slate-500 dark:text-gray-400 text-base max-w-2xl">
            ID de venta: {venta.idVisual}
          </p>
        </div>
        </div>
    
      <div className="bg-white dark:bg-[#1e2736] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Info General (Grid de Tarjetas) */}
        <div className="p-6 space-y-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-700">
          {/* Fila 1: ID, Fecha, Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoCard icon="tag" label="ID Venta" value={venta.idVisual} color="text-blue-600" bgColor="bg-blue-100 dark:bg-blue-900/30" />
            <InfoCard icon="calendar_today" label="Fecha" value={venta.fecha} color="text-orange-600" bgColor="bg-orange-100 dark:bg-orange-900/30" />
            <InfoCard icon="schedule" label="Hora" value={venta.hora} color="text-emerald-600" bgColor="bg-emerald-100 dark:bg-emerald-900/30" />
          </div>
          
          {/* Fila 2: Cliente, Vendedor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon="person" label="Sujeto / Cliente" value={venta.cliente} color="text-purple-600" bgColor="bg-purple-100 dark:bg-purple-900/30" />
            <InfoCard icon="badge" label="Realizado por" value={venta.vendedor} color="text-indigo-600" bgColor="bg-indigo-100 dark:bg-indigo-900/30" />
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Desglose de Productos</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio de Lista</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio Cobrado</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-[#1e2736] divide-y divide-slate-100 dark:divide-slate-700">
                {venta.productos.map((prod, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{prod.nombre}</span>
                        <span className="text-xs text-slate-400">SKU: {prod.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600 dark:text-slate-300">
                      {prod.cantidad}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${prod.precioPromocional ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>
                      {prod.precioUnitario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {prod.precioPromocional ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{prod.precioPromocional}</span>
                          <span className="text-[10px] mt-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                            {prod.descuentoEtiqueta}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900 dark:text-white">
                      {prod.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen y Acciones */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-3">
            <Link href="/historial-ventas" className="px-6 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver
            </Link>
            <BotonExportarVenta venta={venta} />
            <BotonExportarPDF venta={venta} />
          </div>

          <div className="w-full md:w-80 flex flex-col gap-3">
            {venta.descuentoTotal && (
              <>
                <SummaryRow label="Subtotal General:" value={venta.subtotalGeneral} />
                <SummaryRow label="Descuento Total:" value={venta.descuentoTotal} isDiscount />
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
              </>
            )}
            <div className="flex justify-between items-center text-slate-900 dark:text-white">
              <span className="text-lg font-bold">Total Final:</span>
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400">{venta.totalFinal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Nota */}
      <div className="mt-6 flex items-center gap-2 text-slate-400 dark:text-slate-500 justify-center">
        <span className="material-symbols-outlined text-sm">info</span>
        <span className="text-xs uppercase font-semibold tracking-tighter">
          Este documento es una copia de consulta del historial de transacciones.
        </span>
      </div>
    </main>
  );
}

// Subcomponentes auxiliares 

function InfoCard({ icon, label, value, color, bgColor }: any) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-[#1A202C] border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className={`size-10 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider truncate">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white truncate" title={value}>{value}</span>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, isDiscount = false }: any) {
  return (
    <div className={`flex justify-between items-center ${isDiscount ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
      <span className="text-sm">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}