import React, { Suspense } from "react";
import { getEstadisticas } from "@/actions/estadisticas";
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  ShoppingCart, 
  PackageX 
} from "lucide-react";

// Server Component (Rendereo del lado del servidor nativo)
export default async function EstadisticasPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#191919] p-6 pt-24 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Estadísticas del Negocio</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Visión general y métricas clave de tu facturación e inventario.</p>
          </div>
        </header>

        <Suspense fallback={<EstadisticasSkeleton />}>
          <DashboardContent />
        </Suspense>

      </div>
    </div>
  );
}

// Data fetching y pintado de grilla principal
async function DashboardContent() {
  const stats = await getEstadisticas();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* 1. Facturación Bruta */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Facturación Bruta</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatBox label="Hoy" value={`$${stats.facturacion.hoy.toLocaleString('es-AR')}`} />
          <StatBox label="Esta Semana" value={`$${stats.facturacion.semana.toLocaleString('es-AR')}`} />
          <StatBox label="Este Mes" value={`$${stats.facturacion.mes.toLocaleString('es-AR')}`} />
        </div>
      </Card>

      {/* 2. Horarios y Días Pico */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tráfico Pico</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-[#333] p-5 rounded-xl border border-gray-100 dark:border-gray-700">
            {/* Gráfico de Barras CSS Flexbox de Lunes a Domingo */}
            <TrafficBarChart data={stats.picos.traficoPorDia} />
          </div>
          <div className="bg-gray-50 dark:bg-[#333] p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Franja horaria pico</p>
            <p className="text-lg font-black text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 px-3 py-1 rounded-full">{stats.picos.hora}</p>
          </div>
        </div>
      </Card>

      {/* 3. Top 5 Productos (Volumen) */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Más Vendidos<br/><span className="text-sm font-medium text-gray-400 dark:text-gray-500">Por Volumen</span></h2>
        </div>
        <List>
          {stats.topVolumen.length > 0 ? stats.topVolumen.map((p, i) => (
             <ListItem 
                key={i} 
                title={p.nombre} 
                value={p.esPorPeso ? `${p.cantidad.toLocaleString('es-AR')} kg` : `${p.cantidad} u.`} 
             />
          )) : <EmptyState text="No hay ventas registradas." />}
        </List>
      </Card>

      {/* 4. Top 5 Productos (Facturación) */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Estrellas<br/><span className="text-sm font-medium text-gray-400 dark:text-gray-500">Por Facturación</span></h2>
        </div>
        <List>
         {stats.topFacturacion.length > 0 ? stats.topFacturacion.map((p, i) => (
            <ListItem key={i} title={p.nombre} value={`$${p.subtotal.toLocaleString('es-AR')}`} />
          )) : <EmptyState text="No hay ventas registradas." />}
        </List>
      </Card>

      {/* 5. Ranking de Huesos */}
      <Card className="col-span-1 lg:col-span-2">
         <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl">
            <PackageX className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Ranking "Huesos"<br/><span className="text-sm font-medium text-gray-400 dark:text-gray-500">Stock Estancado (Sin ventas en 30 días)</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.huesos.length > 0 ? stats.huesos.map((p, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-[#333] p-4 rounded-xl border border-gray-100 dark:border-gray-700">
               <span className="font-semibold text-gray-800 dark:text-gray-200 truncate pr-2">{p.nombre}</span>
               <span className="flex-shrink-0 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold border border-gray-300 dark:border-gray-500">
                  {p.stock} trap.
               </span>
            </div>
          )) : <EmptyState text="Excelente, no hay stock estancado." />}
        </div>
      </Card>

      {/* 6. Top Deudores Peligrosos */}
      <Card className="col-span-1 border-red-200 dark:border-red-900">
         <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">Riesgo Financiero<br/><span className="text-sm font-medium text-gray-400 dark:text-gray-500">Top Deudores</span></h2>
        </div>
        <List>
          {stats.deudoresPeligrosos.length > 0 ? stats.deudoresPeligrosos.map((d, i) => (
             <ListItem 
                key={i} 
                title={d.nombre} 
                subtitle={d.telefono || "Sin teléfono"}
                value={<span className="text-red-600 dark:text-red-400 font-bold">${Math.abs(d.saldo).toLocaleString('es-AR')}</span>} 
             />
          )) : <EmptyState text="No hay cuentas en rojo." />}
        </List>
      </Card>

    </div>
  );
}


// --- Componentes Reutilizables de UI --- //

function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#222] p-6 rounded-2xl shadow-sm border border-[#ededed] dark:border-[#333] flex flex-col ${className}`}>
      {children}
    </div>
  );
}

function TrafficBarChart({ data }: { data: { dia: string, fullDia: string, ventas: number }[] }) {
  // Encontrar el valor máximo de ventas para calcular la altura relativa (100%)
  const maxVentas = Math.max(...data.map(d => d.ventas), 1); // Evitar división por cero

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between items-end h-[120px] mb-3 relative max-w-[300px] mx-auto w-full px-2">
        {data.map((item, index) => {
          const heightPercentage = Math.round((item.ventas / maxVentas) * 100);
          const isPeak = item.ventas === maxVentas && maxVentas > 0;
          
          return (
            <div key={index} className="flex flex-col items-center justify-end h-full w-[10%] group relative">
              {/* Tooltip Hover */}
              <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                {item.fullDia}: {item.ventas}
                {/* Triangulito del Tooltip */}
                <div className="absolute left-1/2 -ml-1 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-black"></div>
              </div>
              
              {/* Barra */}
              <div 
                className={`w-full rounded-t-sm transition-all duration-500 ${isPeak ? 'bg-blue-600 dark:bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-blue-200 dark:bg-blue-900/60'}`}
                style={{ height: `${Math.max(heightPercentage, 2)}%` }} // Altura mínima de 2% para ver los días sin ventas
              ></div>
            </div>
          );
        })}
      </div>
      
      {/* Eje X (Días) */}
      <div className="flex justify-between items-center text-xs font-bold text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-2 px-2 max-w-[300px] mx-auto w-full">
        {data.map((item, index) => (
          <span 
             key={index} 
             className={`w-[10%] text-center ${item.ventas === maxVentas && maxVentas > 0 ? 'text-blue-600 dark:text-blue-400' : ''}`}
          >
            {item.dia}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-[#333] p-5 rounded-2xl border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center justify-center transition-transform hover:scale-[1.02]">
       <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</p>
       <p className="text-3xl font-black text-gray-900 dark:text-white truncate w-full">{value}</p>
    </div>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="flex flex-col gap-3 flex-1">{children}</ul>;
}

function ListItem({ title, subtitle, value }: { title: string, subtitle?: string, value: string | React.ReactNode }) {
  return (
     <li className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
        <div className="flex flex-col overflow-hidden pr-4">
           <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">{title}</span>
           {subtitle && <span className="text-xs text-gray-400 dark:text-gray-500 truncate">{subtitle}</span>}
        </div>
        <span className="font-bold text-gray-900 dark:text-white flex-shrink-0">{value}</span>
     </li>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-gray-400 dark:text-gray-500 italic py-4 text-center">{text}</p>;
}

function EstadisticasSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-200 dark:bg-[#2a2a2a] h-[200px] rounded-2xl"></div>
      <div className="bg-gray-200 dark:bg-[#2a2a2a] h-[300px] rounded-2xl"></div>
      <div className="bg-gray-200 dark:bg-[#2a2a2a] h-[300px] rounded-2xl"></div>
      <div className="bg-gray-200 dark:bg-[#2a2a2a] h-[300px] rounded-2xl"></div>
    </div>
  );
}
