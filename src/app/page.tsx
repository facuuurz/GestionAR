import Link from "next/link"
import { obtenerMetricasDashboard } from "@/actions/dashboard";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));
};

export default async function Panel() {
  
  const metricas = await obtenerMetricasDashboard();

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col max-w-7xl flex-1">
        
        {/* --- CABECERA DEL PANEL --- */}
        <div className="flex flex-wrap justify-between items-end gap-3 px-4 pb-8">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-primary dark:text-white text-4xl sm:text-5xl font-bold leading-tight tracking-[-0.033em]">
              Bienvenido de nuevo, Admin
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-lg font-normal">
              Aquí está lo que sucede en tu negocio hoy.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 bg-white dark:bg-[#222] px-3 py-1.5 rounded-full border border-[#ededed] dark:border-[#333]">
            <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
            <span>Sistema Operativo</span>
          </div>
        </div>

        {/* --- GRID DE TARJETAS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 p-4">
          
          {/* Tarjeta: Venta */}
          <Link 
            className="xl:col-span-2 group flex flex-col rounded-xl bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 transform hover:-translate-y-1" 
            href="/ventas"
            >
              <div className="relative w-full h-48 bg-cover bg-center" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAor2_y2nb9-anaEp92zSpzkodj1DBI0oiLvg0XIsnGFOmTrOWvmSBCVsiAStpmzuQs7cIj1HIPTd-XuvfyYdttg-96vAWHF4l-N14VntKcyclhzQs5rhX436MGRv3PF0XsOaRalyKKbyq3H8dswShgNhHKRLzdacARpgSpLz5m3Jfe6o11JFjyvv7qOLOw6mnkO8ofBhSg9008fzMurDvJfb2MJygMJJZrEziK9zzq20iE_J2RieR3dJsmvZTMYWrAAh4p7D6j03tk')`}}>              <div className="absolute inset-0 from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center rounded-full bg-indigo-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
                  <span className="material-symbols-outlined text-[14px] mr-1">point_of_sale</span> Caja Abierta
                </span>
              </div>
            </div>
            <div className="flex flex-col flex-1 p-5">
              <div className="flex justify-between items-start mb-2">
                <p className="text-primary dark:text-white text-xl font-bold group-hover:text-blue-600 transition-colors">Venta</p>
                <span className="material-symbols-outlined text-neutral-400">shopping_cart</span>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">Genera ventas de productos, tickets y facturación rápida.</p>
              <div className="mt-auto pt-4 border-t border-[#ededed] dark:border-[#333] flex items-center justify-between">
                <p className="text-primary dark:text-white text-sm font-bold">Nueva Venta</p>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Tarjeta: Stock */}
<Link className="xl:col-span-2 group flex flex-col rounded-xl bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" href="/inventario">
  <div className="relative w-full h-48 bg-cover bg-center" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXdzopWsFirwytLlZdQ2T-VwLsDDHyQrPIXFjPNZnOmM84yF8_-rztmm7J9WHEJZkRgfPAPwNOmtbYjBQwjgd-iskl6vwfx-LNc0b4z2lwUfaRCoZlLoSGH1EbAwphJI4_kSTJSPV0bbVRYgrYXN_1Loi9tr-B3cmLbp65nVO7EjQxXaLrMDDVwaK18G02jeFv4JW2ChVfp2YinqBHcWwu5W5t0JjtIE14DN6ilDaDKp-bpIMNdO3-uPc5K_aW7JPMNeNVC33jiygJ')`}}>
    <div className="absolute inset-0  from-black/60 to-transparent"></div>
    <div className="absolute bottom-4 left-4">
      {metricas.totalProductos === 0 ? (
        <span className="inline-flex items-center rounded-full bg-neutral-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
          <span className="material-symbols-outlined text-[14px] mr-1">inventory</span> Sin productos
        </span>
      ) : metricas.stockTotal === 0 ? (
        <span className="inline-flex items-center rounded-full bg-red-600/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
          <span className="material-symbols-outlined text-[14px] mr-1">block</span> Sin Stock Disponible
        </span>
      ) : metricas.productosStockBajo > 0 ? (
        <span className="inline-flex items-center rounded-full bg-orange-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
          <span className="material-symbols-outlined text-[14px] mr-1">warning</span> Alerta de Stock Bajo
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-green-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
          <span className="material-symbols-outlined text-[14px] mr-1">check_circle</span> Stock Estable
        </span>
      )}
    </div>
  </div>
  <div className="p-5 flex-1 flex flex-col">
    <div className="flex justify-between items-start mb-2">
      <p className="text-primary dark:text-white text-xl font-bold group-hover:text-blue-600 transition-colors">Inventario</p>
      <span className="material-symbols-outlined text-neutral-400">inventory_2</span>
    </div>
    <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">Gestiona inventario, almacenes y seguimiento en tiempo real.</p>
    <div className="mt-auto pt-4 border-t border-[#ededed] dark:border-[#333] flex items-center justify-between">
      <p className="text-primary dark:text-white text-sm font-bold">
          {metricas.totalProductos} Ítems Totales
      </p>
      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
    </div>
  </div>
</Link>

          {/* Tarjeta: Cuentas Corrientes */}
          <Link 
            className="xl:col-span-2 group flex flex-col rounded-xl bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
            href="/cuentas-corrientes"
          >
            <div className="relative w-full h-48 bg-cover bg-center" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfGMEdhP1OzxBoq3a_Tyj5cRIiEZmDl7qvZxOSQds7H4yNhQPw2QskXNYEMihzDlrz7CWBMWkIxlfehSdgJjj2oNAJjfmlabu6KfBcAYEH9yVVJc6e0ZLDcF5KdDFR7XotN8_qMKMwgUuoyoddurmB82Nt7YIDmlh-3lZ_pxwC9e8b6RHww2RKWqbIk-_iOaET5XR2vbRCUDmevfEpf1szv61Jcia11Xk6Jp2UIJ2Z2_N6ej01Magc5Vk3rFdHwQe30wtUT-2_BvVj')`}}>
              <div className="absolute inset-0 from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center rounded-full bg-blue-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
                  <span className="material-symbols-outlined text-[14px] mr-1">pending</span> {metricas.clientesDeudores} Pendientes 
                  </span> 
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <p className="text-primary dark:text-white text-xl font-bold group-hover:text-blue-600 transition-colors">Cuentas Corrientes</p>
                <span className="material-symbols-outlined text-neutral-400">account_balance_wallet</span>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">Monitorea saldos de clientes, facturación e historial de pagos.</p>
              <div className="mt-auto pt-4 border-t border-[#ededed] dark:border-[#333] flex items-center justify-between">
                <p className="text-primary dark:text-white text-sm font-bold">
                    {formatCurrency(metricas.deudaTotal)} Pendiente
                </p>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </Link>

          {/* Tarjeta: Promociones (Ancha) */}
<Link 
  className="xl:col-span-3 group flex flex-col rounded-xl bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
  href="/promociones"
>
  <div className="relative w-full h-48 bg-cover bg-center" style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-TKVWStBi45-oCdf2wdITmTtwKVeBerJWoOI41z6QIJkA17qYci2r9-0z1-_Jc3IuGMtC6ZHqi0L3uFXBfTzTaLX4Bp6z1gFVupxJfyUl1lZAzciEmrqyp0wXunQUFE7orn-iOxhnqqsR-k5IRXCUqvQgt-4gBhW3MwmZp4mu_KF-PtUvMmYpEGm2BLM7XZsYAbBskXvT7BXaPUQaEqS8cBlwzOk_u0uKdWpSce8YoDEniIdpRJ8M0VPWmnuUrNapLdUry1FI4Hgc')`}}>
    <div className="absolute inset-0 from-black/60 to-transparent"></div>
    <div className="absolute bottom-4 left-4">
      {metricas.promocionesActivas > 0 ? (
        <span className="inline-flex items-center rounded-full bg-green-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
          <span className="material-symbols-outlined text-[14px] mr-1">bolt</span> Activo Ahora
        </span>
      ) : (
        <span className="inline-flex items-center rounded-full bg-neutral-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
          <span className="material-symbols-outlined text-[14px] mr-1">campaign</span> Sin campañas activas
        </span>
      )}
    </div>
  </div>
  <div className="p-5 flex-1 flex flex-col">
    <div className="flex justify-between items-start mb-2">
      <p className="text-primary dark:text-white text-xl font-bold group-hover:text-blue-600 transition-colors">Promociones</p>
      <span className="material-symbols-outlined text-neutral-400">campaign</span>
    </div>
    <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">Crea descuentos, gestiona campañas y ofertas especiales.</p>
    <div className="mt-auto pt-4 border-t border-[#ededed] dark:border-[#333] flex items-center justify-between">
      <p className="text-primary dark:text-white text-sm font-bold">
          {metricas.promocionesActivas} Promociones Activas
      </p>
      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
    </div>
  </div>
</Link>

          {/* Tarjeta: Proveedores (Ancha) */}
          <Link className="md:col-span-2 xl:col-span-3 group flex flex-col rounded-xl bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" 
                href="/proveedores"> 
            
            <div className="relative w-full h-48 bg-cover bg-center" style={{backgroundImage: `url('https://plus.unsplash.com/premium_photo-1681488229881-d733064c22cf?q=80&w=746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`}}>
              <div className="absolute inset-0 from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center rounded-full bg-purple-500/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white">
                  <span className="material-symbols-outlined text-[14px] mr-1">local_shipping</span> En Camino
                </span>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <p className="text-primary dark:text-white text-xl font-bold group-hover:text-blue-600 transition-colors">Proveedores</p>
                <span className="material-symbols-outlined text-neutral-400">local_shipping</span>
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">Gestiona proveedores, pedidos y logística de entrega.</p>
              <div className="mt-auto pt-4 border-t border-[#ededed] dark:border-[#333] flex items-center justify-between">
                <p className="text-primary dark:text-white text-sm font-bold">
                    {metricas.totalProveedores} Distribuidores
                </p>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}