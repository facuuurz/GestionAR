import React from 'react';
import Link from 'next/link';

interface Props {
  producto: any;
  onClose: () => void;
}

export function ProductDetailsModal({ producto, onClose }: Props) {
  if (!producto) return null;

  // Calculamos porcentaje (ejemplo)
  const maxStock = 200;
  const porcentaje = Math.min((producto.stock / maxStock) * 100, 100);

  return (
    // Fondo oscuro con desenfoque
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Contenedor Principal */}
      <div className="relative w-full max-w-5xl bg-background-dark border border-neutral-800 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors z-10"
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="p-8 lg:p-10">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 py-2 mb-2">
            <span className="text-neutral-500 text-sm font-medium">Inventario</span>
            <span className="text-neutral-500 text-sm font-medium">/</span>
            <span className="text-white text-sm font-medium">{producto.nombre}</span>
          </div>

          {/* Encabezado */}
          <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-white text-4xl font-black leading-tight tracking-tight">
                Detalles del Producto
              </h2>
              <p className="text-neutral-400 text-base">
                Información detallada del artículo seleccionado.
              </p>
            </div>
            
            <Link 
              href={`/inventario/editar/${producto.id}`} 
              className="flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-bold transition-all hover:bg-neutral-200"
            >
              <span className="material-symbols-outlined">edit</span>
              Actualizar Producto
            </Link>
          </div>

          {/* Barra de Progreso */}
          <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 p-6 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex gap-6 justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white">inventory_2</span>
                  <p className="text-white text-lg font-bold">Estado de Stock</p>
                </div>
                {/* Texto blanco para que resalte */}
                <p className="text-white text-xl font-black">{Math.round(porcentaje)}%</p>
              </div>
              <div className="h-3 rounded-full bg-neutral-800 overflow-hidden">
                {/* Barra blanca */}
                <div 
                  className="h-full rounded-full bg-white transition-all duration-500" 
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-neutral-500 text-sm">
                <p>Stock disponible: {producto.stock} unidades</p>
                <p>Capacidad máx: {maxStock}</p>
              </div>
            </div>
          </div>

          {/* Grid de Detalles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <InfoCard 
              icon="barcode_scanner" 
              label="Código de Barra" 
              value={producto.codigoBarra || "Sin código"} 
            />

            <InfoCard 
              icon="label" 
              label="Nombre del Producto" 
              value={producto.nombre} 
            />

            <InfoCard 
              icon="package_2" 
              label="Stock Actual" 
              value={`${producto.stock} unidades`} 
            />

            <InfoCard 
              icon="payments" 
              label="Precio Unitario" 
              value={`$${Number(producto.precio).toFixed(2)}`} 
            />

            <InfoCard 
              icon="category" 
              label="Tipo de Producto" 
              value={producto.tipo || "Sin categoría"} 
            />

            <InfoCard 
              icon="local_shipping" 
              label="Proveedor" 
              value={producto.proveedor || "No especificado"} 
            />
          </div>

          {/* Footer Info */}
          <div className="mt-8 p-6 rounded-xl bg-neutral-900/30 border border-dashed border-neutral-800">
            <div className="flex items-center gap-4 text-neutral-500">
              <span className="material-symbols-outlined">info</span>
              <p className="text-sm">
                Producto registrado en el sistema. ID Interno: #{producto.id}.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponente simplificado para diseño Minimalista Dark
function InfoCard({ icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 hover:border-white/30 transition-colors group">
      <div className="flex items-center gap-3">
        {/* Icono blanco sobre fondo oscuro suave */}
        <div className="p-3 rounded-lg bg-white/5 text-white">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <h2 className="text-neutral-500 text-xs font-bold uppercase tracking-wider">{label}</h2>
      </div>
      <p className="text-white text-xl font-bold leading-tight truncate">{value}</p>
    </div>
  );
}