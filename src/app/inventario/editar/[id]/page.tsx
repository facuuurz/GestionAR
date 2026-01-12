import { prisma } from "@/lib/prisma";
import { actualizarProducto, eliminarProducto } from "@/actions/productos";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNumerico = parseInt(id);

  const producto = await prisma.producto.findUnique({
    where: { id: idNumerico },
  });

  if (!producto) {
    redirect("/inventario");
  }

  // Colores "Neón"
  const colors = {
    primary: "text-[#13ec13] border-[#13ec13]/30",
    blue: "text-[#3b82f6] border-[#3b82f6]/30",
    purple: "text-[#a855f7] border-[#a855f7]/30",
    orange: "text-[#f97316] border-[#f97316]/30",
    pink: "text-[#ec4899] border-[#ec4899]/30",
    gray: "text-slate-400 border-slate-600/30",
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      
      <main className="px-6 md:px-20 lg:px-40 py-12 flex justify-center">
        <div className="w-full max-w-[1000px]">
          
          {/* Breadcrumbs */}
          <div className="flex gap-2 text-sm mb-8 text-neutral-500">
             <span>Inventario</span> <span>/</span> <span className="text-[#13ec13]">Editar Producto</span>
          </div>

          <div className="mb-10 border-b border-neutral-900 pb-8">
            <h1 className="text-4xl font-black text-white mb-2">Editar Producto</h1>
            <p className="text-neutral-400">Modifique los campos necesarios para actualizar el inventario.</p>
          </div>

          {/* FORMULARIO */}
          <form action={actualizarProducto} className="bg-[#141414] p-8 md:p-12 rounded-3xl border border-neutral-800 shadow-2xl">
            <input type="hidden" name="id" value={producto.id} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">

              <InputGroup 
                label="Código de Barra"
                name="codigoBarra"
                defaultValue={producto.codigoBarra}
                icon="barcode_scanner"
                colorClass={colors.primary}
              />

              <InputGroup 
                label="Nombre del Producto"
                name="nombre"
                defaultValue={producto.nombre}
                icon="sell"
                colorClass={colors.blue}
              />

              <InputGroup 
                label="Stock Disponible"
                name="stock"
                type="number"
                defaultValue={producto.stock}
                icon="inventory_2"
                colorClass={colors.purple}
              />

              <InputGroup 
                label="Precio Unitario ($)"
                name="precio"
                type="number"
                step="0.01"
                defaultValue={Number(producto.precio)}
                icon="payments"
                colorClass={colors.orange}
              />

              {/* TIPO DE PRODUCTO (Select) */}
              <div className="flex flex-col gap-3">
                <label className="text-neutral-500 text-xs font-bold uppercase tracking-wider ml-1">Tipo de Producto</label>
                
                <div className="flex items-center bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden focus-within:border-[#ec4899] focus-within:ring-1 focus-within:ring-[#ec4899] h-[64px]">
                    <div className="pl-1 pr-3 flex items-center justify-center h-full bg-[#0a0a0a]">
                        <div className={`size-10 rounded-lg border ${colors.pink} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-xl">category</span>
                        </div>
                    </div>
                    <div className="flex-1 h-full relative">
                        <select 
                            name="tipo"
                            defaultValue={producto.tipo || "Almacén"}
                            className="w-full h-full bg-[#0a0a0a] text-white font-medium outline-none px-2 appearance-none cursor-pointer"
                        >
                            <option className="bg-black" value="Almacén">Almacén</option>
                            <option className="bg-black" value="Bebidas">Bebidas</option>
                            <option className="bg-black" value="Lácteos">Lácteos</option>
                            <option className="bg-black" value="Limpieza">Limpieza</option>
                            <option className="bg-black" value="Otros">Otros</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                            <span className="material-symbols-outlined">expand_more</span>
                        </div>
                    </div>
                </div>
              </div>

              <InputGroup 
                label="Código de Proveedor"
                name="proveedor"
                defaultValue={producto.proveedor}
                icon="local_shipping"
                colorClass={colors.gray}
              />
            </div>

            {/* SECCIÓN DE BOTONES: Ahora con margin-top: 32 (más separado) */}
            <div className="mt-32 pt-10 border-t border-neutral-800 flex flex-col items-center w-full max-w-md mx-auto gap-4">
                
                {/* 1. GUARDAR (Primero) */}
                <button 
                    type="submit"
                    className="flex items-center justify-center gap-3 bg-white text-black hover:bg-neutral-200 font-black px-12 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:-translate-y-1 transition-all w-full"
                >
                    <span className="material-symbols-outlined font-bold">save</span>
                    GUARDAR CAMBIOS
                </button>

                {/* 2. CANCELAR (Segundo) */}
                <Link 
                    href="/inventario"
                    className="px-10 py-3 rounded-xl text-neutral-500 font-bold hover:text-white hover:bg-neutral-900 transition-colors text-center w-full"
                >
                    Cancelar
                </Link>

                {/* 3. ELIMINAR (Separado al final) */}
                <button 
                    formAction={eliminarProducto}
                    className="flex items-center justify-center gap-2 text-red-600 hover:text-red-500 text-sm font-bold px-6 py-3 rounded-lg hover:bg-red-500/5 transition-colors mt-8 opacity-60 hover:opacity-100"
                >
                    <span className="material-symbols-outlined text-lg">delete</span>
                    Eliminar este producto permanentemente
                </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

// InputGroup Ajustado: Icono pegado al borde izquierdo (pl-1)
function InputGroup({ label, name, defaultValue, type = "text", icon, colorClass, step }: any) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-neutral-500 text-xs font-bold uppercase tracking-wider ml-1">{label}</label>
      
      <div className="flex items-center w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl overflow-hidden focus-within:border-white focus-within:ring-1 focus-within:ring-white transition-all h-[64px]">
        {/* pl-1 para que el icono no tenga espacio extra a la izquierda */}
        <div className="pl-1 pr-3 flex items-center justify-center h-full bg-[#0a0a0a]">
          <div className={`size-10 rounded-lg border ${colorClass} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        </div>
        <input 
          name={name}
          defaultValue={defaultValue || ""}
          type={type}
          step={step}
          className="flex-1 h-full bg-transparent text-white font-medium outline-none pr-4 placeholder-neutral-700"
        />
      </div>
    </div>
  );
}