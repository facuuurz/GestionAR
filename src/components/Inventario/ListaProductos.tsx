import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EstadoStockBadge from "@/components/Inventario/ui/EstadoStockBadge";
import VencimientoBadge from "@/components/Inventario/ui/VencimientoBadge";
import EliminarProductoModal from "@/components/Inventario/Modal/EliminarProductoModal";
import { eliminarProducto } from "@/actions/productos";
import { toast } from "react-hot-toast";

interface ProductRowProps {
  prod: any; 
  isAdmin?: boolean;
  onDeleteSuccess?: () => void;
}

export default function ProductRow({ prod, isAdmin = true, onDeleteSuccess }: ProductRowProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  let displayPrecio = `$${Number(prod.precio).toFixed(2)}`;
  
  if (prod.esPorPeso) {
      displayPrecio += " /kg";
  }

  // --- 2. LÓGICA DE TEXTO ---
  const descripcionCorta = prod.descripcion && prod.descripcion.length > 50 
    ? prod.descripcion.substring(0, 50) + "..." 
    : prod.descripcion;

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const formData = new FormData();
    formData.append("id", prod.id.toString());

    try {
        await eliminarProducto(formData);
        setIsDeleting(false);
        setShowDeleteModal(false);
        toast.success("Producto eliminado correctamente", {
            style: { background: "#EF4444", color: "#fff", padding: "16px" }, // Red
            iconTheme: { primary: "#fff", secondary: "#EF4444" }
        });
        if (onDeleteSuccess) onDeleteSuccess();
        router.refresh(); 
    } catch (error: any) {
        setIsDeleting(false);
        setShowDeleteModal(false);
        
        if (error.message === "NEXT_REDIRECT") {
            toast.success("Producto eliminado correctamente", {
                style: { background: "#EF4444", color: "#fff", padding: "16px" }, // Red
                iconTheme: { primary: "#fff", secondary: "#EF4444" }
            });
            if (onDeleteSuccess) onDeleteSuccess();
            router.refresh(); 
            throw error;
        }
        console.error(error);
        toast.error("Error al eliminar el producto");
    }
  };

  return (
    <>
      <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
        
        {/* CÓDIGO */}
        <td className="px-4 py-3 text-sm font-bold dark:text-neutral-400 font-mono hover:underline hover:text-blue-600 cursor-pointer text-[#135bec]">
          <Link href={`/inventario/detalles-producto/${prod.id}`}>
            {prod.codigoBarra || prod.id}
          </Link>
        </td>

        {/* PRODUCTO */}
        <td className="px-4 py-3">
          <div className="flex flex-col">
            <Link 
              href={`/inventario/detalles-producto/${prod.id}`}
              className="text-left text-sm font-bold text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline hover:underline-offset-2 transition-colors"
            >
              {prod.nombre}
            </Link>
            
            {prod.descripcion && (
              <span className="text-xs text-neutral-500 mt-0.5" title={prod.descripcion}>
                  {descripcionCorta}
              </span>
            )}
          </div>
        </td>

        {/* STOCK */}
        <td className="px-4 py-3">
          <EstadoStockBadge stock={prod.stock} esPorPeso={prod.esPorPeso} />
        </td>

        {/* VENCIMIENTO ACTUALIZADO */}
        <td className="px-4 py-3 text-sm whitespace-nowrap text-center">
          <VencimientoBadge fechaVencimiento={prod.fechaVencimiento} />
        </td>

        {/* PRECIO */}
        <td className="px-4 py-3 text-sm font-medium text-primary dark:text-white">
          {displayPrecio}
        </td>

        {/* TIPO */}
        <td className="px-4 py-3">
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-[#444] text-gray-800 dark:text-neutral-300">
            {prod.tipo || "Sin tipo"}
          </span>
        </td>

        {/* PROVEEDOR */}
        <td className="px-4 py-3 text-sm text-neutral-500 font-mono">
          {prod.proveedor || "-"}
        </td>
        
        {/* ACCIONES */}
        {isAdmin && (
          <td className="px-4 py-3 text-center sticky right-0 bg-[#f9f9f9] dark:bg-[#222] group-hover:bg-neutral-50 dark:group-hover:bg-[#333] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
            <div className="flex items-center justify-center gap-2">
              <Link 
                href={`/inventario/editar/${prod.id}`}
                className="bg-black hover:bg-neutral-800 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all shadow-sm flex flex-col items-center justify-center dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                 <span className="material-symbols-outlined text-[14px] leading-tight mb-0.5">edit</span>
                 Editar
              </Link>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-2 py-1.5 text-[11px] font-bold transition-all shadow-sm flex flex-col items-center justify-center"
              >
                 <span className="material-symbols-outlined text-[14px] leading-tight mb-0.5">delete</span>
                 Borrar
              </button>
            </div>
            <EliminarProductoModal 
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={handleConfirmDelete}
              isDeleting={isDeleting}
              nombreProducto={prod.nombre}
              stockActual={prod.stock}
            />
          </td>
        )}
      </tr>
    </>
  );
}