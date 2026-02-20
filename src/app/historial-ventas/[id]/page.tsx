import React from 'react';

export default function DetalleVenta() {
  // Datos simulados de los productos
  const productos = [
    {
      nombre: 'Monitor LED 24" Full HD',
      sku: 'MON-24-FHD',
      cantidad: 2,
      precioUnitario: '$150.000,00',
      precioPromocional: '$135.000,00',
      descuentoEtiqueta: 'Promo 10% OFF',
      subtotal: '$270.000,00',
    },
    {
      nombre: 'Teclado Mecánico RGB',
      sku: 'TEC-RGB-MK',
      cantidad: 1,
      precioUnitario: '$45.500,00',
      precioPromocional: null,
      subtotal: '$45.500,00',
    },
    {
      nombre: 'Mouse Gamer Pro',
      sku: 'MOU-GPRO-01',
      cantidad: 3,
      precioUnitario: '$22.000,00',
      precioPromocional: '$18.700,00',
      descuentoEtiqueta: '3x2 Oferta',
      subtotal: '$56.100,00',
    },
  ];

  return (
    <main className="flex-1 max-w-300 mx-auto w-full px-4 py-8 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <a className="text-primary text-sm font-medium hover:underline" href="#">Panel</a>
        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
        <a className="text-primary text-sm font-medium hover:underline" href="#">Historial de Ventas</a>
        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Detalle de Venta #1234</span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Info General (Grid de Tarjetas) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
          
          <InfoCard icon="tag" label="ID Venta" value="#1234" color="text-primary" bgColor="bg-primary/10" />
          <InfoCard icon="calendar_today" label="Fecha" value="24/05/2024" color="text-orange-600" bgColor="bg-orange-100 dark:bg-orange-900/30" />
          <InfoCard icon="schedule" label="Hora" value="14:35" color="text-emerald-600" bgColor="bg-emerald-100 dark:bg-emerald-900/30" />
          <InfoCard icon="person" label="Sujeto / Cliente" value="Consumidor Final" color="text-purple-600" bgColor="bg-purple-100 dark:bg-purple-900/30" />
          
        </div>

        {/* Tabla de Productos */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Desglose de Productos</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio Unitario</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio Promocional</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                {productos.map((prod, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{prod.nombre}</span>
                        <span className="text-xs text-slate-400">SKU: {prod.sku}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-600 dark:text-slate-300">{prod.cantidad}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${prod.precioPromocional ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>
                      {prod.precioUnitario}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {prod.precioPromocional ? (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{prod.precioPromocional}</span>
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 rounded-full font-medium">
                            {prod.descuentoEtiqueta}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900 dark:text-white">{prod.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen y Acciones */}
        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 bg-slate-50 dark:bg-slate-800/30">
          <div className="flex gap-3">
            <button className="px-6 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver
            </button>
            <button className="px-6 h-11 bg-slate-900 dark:bg-slate-700 rounded-lg text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
              <span className="material-symbols-outlined text-lg">print</span>
              Reimprimir Ticket
            </button>
          </div>

          <div className="w-full md:w-80 flex flex-col gap-3">
            <SummaryRow label="Subtotal General:" value="$389.500,00" />
            <SummaryRow label="Descuento Promociones:" value="-$17.900,00" isDiscount />
            <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
            <div className="flex justify-between items-center text-slate-900 dark:text-white">
              <span className="text-base font-bold">Total Final:</span>
              <span className="text-2xl font-black text-primary">$371.600,00</span>
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

// --- Subcomponentes auxiliares para evitar repetición ---

function InfoCard({ icon, label, value, color, bgColor }: any) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className={`size-10 rounded-lg ${bgColor} flex items-center justify-center ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{value}</span>
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