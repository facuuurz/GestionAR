"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { eliminarProveedor } from "@/actions/proveedores";
import EliminarProveedorModal from "@/components/Proveedores/Modal/EliminarProveedorModal";

interface ProveedorRowProps {
  prov: any;
  isAdmin: boolean;
  onDeleteSuccess?: () => void;
}

export default function ProveedorRow({ prov, isAdmin, onDeleteSuccess }: ProveedorRowProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
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
                    className="font-medium text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer transition-colors"
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
            <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-neutral-50 dark:bg-[#1e2736] dark:group-hover:bg-[#1a222e] z-10 transition-colors shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
                <div className="flex items-center justify-center gap-2">
                    <Link 
                        href={`/proveedores/editar/${prov.id}`} 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-lg hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm max-w-[110px]"
                    >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Actualizar
                    </Link>
                    <button 
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
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
                />
            </td>
        )}
    </tr>
  );
}
