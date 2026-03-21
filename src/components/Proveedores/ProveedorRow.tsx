"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { eliminarProveedor, inactivarProveedor, activarProveedor, obtenerProductosProveedoresConStock } from "@/actions/proveedores";
import EliminarProveedorModal from "@/components/Proveedores/Modal/EliminarProveedorModal";
import ToggleProveedorModal from "@/components/Proveedores/Modal/ToggleProveedorModal";

interface ProveedorRowProps {
  prov: any;
  isAdmin: boolean;
  onDeleteSuccess?: () => void;
}

export default function ProveedorRow({ prov, isAdmin, onDeleteSuccess }: ProveedorRowProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Productos asociados
  const [productosAfectados, setProductosAfectados] = useState<{nombre: string, stock: number}[]>([]);
  const [totalProductosAfectados, setTotalProductosAfectados] = useState(0);
  const [isLoadingProductos, setIsLoadingProductos] = useState(false);
  
  // Toggle Modal State
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [toggleMode, setToggleMode] = useState<"activar" | "inactivar">("activar");

  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    ];
    return colors[id % colors.length];
  };

  const openToggleModal = (mode: "activar" | "inactivar") => {
    setToggleMode(mode);
    setShowToggleModal(true);
  };

  const handleConfirmToggle = async () => {
    setIsToggling(true);
    try {
        if (toggleMode === "activar") {
            const result = await activarProveedor(prov.id);
            if (result?.error) throw new Error(result.error);
            toast.success("Proveedor activado correctamente");
        } else {
            const result = await inactivarProveedor(prov.id);
            if (result?.error) throw new Error(result.error);
            toast.success("Proveedor inactivado correctamente");
        }
        setShowToggleModal(false);
        router.refresh();
    } catch (error: any) {
        toast.error(error.message || `Error al ${toggleMode} el proveedor`);
    } finally {
        setIsToggling(false);
    }
  };

  const handleOpenDeleteModal = async () => {
    setShowDeleteModal(true);
    setIsLoadingProductos(true);
    try {
        const data = await obtenerProductosProveedoresConStock(prov.codigo);
        setProductosAfectados(data.productos);
        setTotalProductosAfectados(data.totalCount);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoadingProductos(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
        const formData = new FormData();
        formData.append("id", prov.id.toString());
        const result = await eliminarProveedor({ message: "" }, formData);
        
        if (result && result.message && !result.success) {
            throw new Error(result.message);
        }

        setIsDeleting(false);
        setShowDeleteModal(false);
        toast.success("Proveedor eliminado correctamente");
        if (onDeleteSuccess) onDeleteSuccess();
        router.refresh(); 
    } catch (error: any) {
        setIsDeleting(false);
        setShowDeleteModal(false);
        
        if (error.message === "NEXT_REDIRECT") {
            toast.success("Proveedor eliminado correctamente");
            if (onDeleteSuccess) onDeleteSuccess();
            router.refresh(); 
            throw error;
        }
        console.error(error);
        toast.error(error.message || "Error al eliminar el proveedor");
    }
  };

  return (
    <tr className={`transition-colors group ${
        !prov.activo 
            ? "bg-neutral-100/50 dark:bg-neutral-800/30 opacity-60 hover:opacity-80 grayscale-[30%]" 
            : "hover:bg-neutral-50 dark:hover:bg-[#333]/50"
    }`}>
        <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400 font-mono">
            {prov.codigo}
        </td>
        <td className="px-4 py-3">
            <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarColor(prov.id)}`}>
                    {prov.razonSocial.substring(0, 2).toUpperCase()}
                </div>
                <Link 
                    href={`/proveedores/${prov.id}`}
                    className={`font-medium cursor-pointer transition-colors ${
                        !prov.activo
                            ? "text-neutral-500 dark:text-neutral-400 italic hover:text-neutral-700 dark:hover:text-neutral-300"
                            : "text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                    }`}
                >
                    {prov.razonSocial}
                </Link>
            </div>
        </td>
        <td className="px-4 py-3 text-neutral-500 dark:text-gray-400 hidden md:table-cell">{prov.contacto || "-"}</td>
        <td className="px-4 py-3 text-neutral-500 dark:text-gray-400 hidden md:table-cell">
            {prov.telefono ? (
                <a href={`tel:${prov.telefono}`} className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                    <span className="material-symbols-outlined text-[15px]">call</span>
                    {prov.telefono}
                </a>
            ) : (
                <span>-</span>
            )}
        </td>
        
        {isAdmin && (
            <td className={`px-4 py-3 text-center sticky right-0 z-10 transition-colors shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333] ${
                !prov.activo 
                    ? "bg-neutral-50 dark:bg-[#1a222e] group-hover:bg-neutral-100 dark:group-hover:bg-[#202936]" 
                    : "bg-white group-hover:bg-neutral-50 dark:bg-[#1e2736] dark:group-hover:bg-[#1a222e]"
            }`}>
                <div className="flex items-center justify-center gap-2">
                    {prov.activo ? (
                        <Link 
                            href={`/proveedores/editar/${prov.id}`} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-lg hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm max-w-[110px]"
                        >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            Actualizar
                        </Link>
                    ) : (
                        <button 
                            disabled
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-300 text-neutral-500 text-xs font-bold rounded-lg dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed opacity-70 shadow-sm max-w-[110px]"
                            title="No se puede editar un proveedor inactivo"
                        >
                            <span className="material-symbols-outlined text-[16px]">edit_off</span>
                            Actualizar
                        </button>
                    )}
                    {prov.activo ? (
                        <button
                            type="button"
                            onClick={() => openToggleModal("inactivar")}
                            disabled={isToggling}
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Inactivar Proveedor"
                        >
                            <span className="material-symbols-outlined text-[16px]">block</span>
                            Inactivar
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openToggleModal("activar")}
                            disabled={isToggling}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Activar Proveedor"
                        >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            Activar
                        </button>
                    )}
                    <button 
                        type="button"
                        onClick={handleOpenDeleteModal}
                        className="bg-red-600 hover:bg-red-700 text-white rounded p-1.5 transition-all shadow-sm flex items-center justify-center hover:scale-105 active:scale-95"
                        title="Eliminar Proveedor"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>

                <EliminarProveedorModal 
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                    isDeleting={isDeleting}
                    nombreProveedor={prov.razonSocial}
                    productosAfectados={productosAfectados}
                    totalProductosAfectados={totalProductosAfectados}
                    isLoadingProductos={isLoadingProductos}
                />

                <ToggleProveedorModal
                    isOpen={showToggleModal}
                    onClose={() => setShowToggleModal(false)}
                    onConfirm={handleConfirmToggle}
                    isToggling={isToggling}
                    nombreProveedor={prov.razonSocial}
                    isActivating={toggleMode === "activar"}
                />
            </td>
        )}
    </tr>
  );
}
