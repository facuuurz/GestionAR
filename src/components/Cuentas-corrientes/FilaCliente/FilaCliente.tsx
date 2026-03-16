"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import SaldarModal from "../SaldarModal";
import { actualizarSaldoCliente, eliminarCliente } from "@/actions/cuentas-corrientes";
import EliminarClienteModal from "@/components/Cuentas-corrientes/Modal/EliminarClienteModal";

interface ClienteRowProps {
  cliente: any; 
  onDeleteSuccess?: () => void;
}

export default function FilaCliente({ cliente, onDeleteSuccess }: ClienteRowProps) {
  const router = useRouter();
  const [showSaldarModal, setShowSaldarModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- ESTADOS PARA ACTUALIZACIÓN EN TIEMPO REAL ---
  const [saldoVisual, setSaldoVisual] = useState(Number(cliente.saldo));
  const [estadoVisual, setEstadoVisual] = useState(cliente.estado);

  useEffect(() => {
    setSaldoVisual(Number(cliente.saldo));
    setEstadoVisual(cliente.estado);
  }, [cliente.saldo, cliente.estado]);

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  let badgeClass = "";
  let iconName = "";

  switch (estadoVisual) {
    case "Al Día":
        badgeClass = "bg-[#dcfce7] text-[#166534] dark:bg-green-900/30 dark:text-green-300";
        iconName = "check_circle";
        break;
    case "Deudor":
        badgeClass = "bg-[#fee2e2] text-[#991b1b] dark:bg-red-900/30 dark:text-red-300";
        iconName = "error";
        break;
    case "Pendiente":
        badgeClass = "bg-[#fef9c3] text-[#854d0e] dark:bg-yellow-900/30 dark:text-yellow-300";
        iconName = "warning";
        break;
    default:
        badgeClass = "bg-gray-100 text-gray-800";
        iconName = "help";
  }

  const handleConfirmarSaldo = async (monto: number) => {
    const nuevoSaldo = saldoVisual + monto;
    setSaldoVisual(nuevoSaldo);
    
    if (nuevoSaldo >= 0 && estadoVisual === "Deudor") {
        setEstadoVisual("Al Día");
    }

    const result = await actualizarSaldoCliente(cliente.id, monto);
    
    if (!result.success) {
        setSaldoVisual(Number(cliente.saldo));
        setEstadoVisual(cliente.estado);
        alert("Hubo un error al guardar el saldo. Se han revertido los cambios.");
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
        await eliminarCliente(cliente.id);
        setIsDeleting(false);
        setShowDeleteModal(false);
        toast.success("Cliente eliminado correctamente");
        if (onDeleteSuccess) onDeleteSuccess();
        router.refresh(); 
    } catch (error: any) {
        setIsDeleting(false);
        setShowDeleteModal(false);
        
        if (error.message === "NEXT_REDIRECT") {
            toast.success("Cliente eliminado correctamente");
            if (onDeleteSuccess) onDeleteSuccess();
            router.refresh(); 
            throw error;
        }
        console.error(error);
        toast.error("Error al eliminar el cliente");
    }
  };

  // --- CORRECCIÓN AQUÍ: Eliminamos el fragmento <> y ponemos el Modal DENTRO del último td ---
  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
    
        {/* ID CLIENTE */}
        <td className="px-4 py-3 text-sm font-bold dark:text-neutral-400 font-mono hover:underline hover:text-blue-600 cursor-pointer text-[#135bec]">
            <Link href={`/cuentas-corrientes/${cliente.id}`}>
            CC-{cliente.id.toString().padStart(5, '0')}
            </Link>
        </td>

        {/* CLIENTE / RAZÓN SOCIAL */}
        <td className="px-4 py-3">
            <div className="flex flex-col">
            <Link 
                href={`/cuentas-corrientes/${cliente.id}`}
                className="text-left text-sm font-bold text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline hover:underline-offset-2 transition-colors"
            >
                {cliente.nombre}
            </Link>
            <span className="text-xs text-neutral-500 mt-0.5">
                CUIT: {cliente.cuit || "-"}
            </span>
            </div>
        </td>

        {/* ESTADO */}
        <td className="px-4 py-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}`}>
            <span className="material-symbols-outlined text-[16px] mr-1.5">{iconName}</span>
            {estadoVisual}
            </span>
        </td>

        {/* SALDO ACTUAL */}
        <td className={`px-4 py-3 text-sm font-medium ${saldoVisual < 0 ? 'text-[#991b1b] dark:text-red-400' : 'text-[#166534] dark:text-green-400'}`}>
            {formatMoney(saldoVisual)}
        </td>

        {/* ACCIONES + MODAL (El modal ahora vive dentro de este td para validar HTML) */}
        <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-[#222] group-hover:bg-neutral-50 dark:group-hover:bg-[#333] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
            <div className="flex items-center justify-center gap-2">
                
                <button 
                    onClick={() => setShowSaldarModal(true)}
                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-500 ease-in-out group-hover:rotate-12">
                        attach_money 
                    </span>
                    <span>Saldar</span>
                </button>

                <Link 
                href={`/cuentas-corrientes/editar/${cliente.id}`}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black"
                >
                <span className="material-symbols-outlined text-[16px] transition-transform duration-500 ease-in-out group-hover:rotate-12">
                    edit 
                </span>
                <span>Actualizar</span>
                </Link>

                <button 
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded p-1.5 transition-all shadow-sm flex items-center justify-center hover:scale-105 active:scale-95"
                  title="Eliminar Cliente"
                >
                   <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>

            </div>

            {/* ✅ MODALES MOVIDOS AQUÍ DENTRO DEL TD */}
            <SaldarModal 
                isOpen={showSaldarModal}
                onClose={() => setShowSaldarModal(false)}
                onConfirm={handleConfirmarSaldo}
                clienteNombre={cliente.nombre}
                saldoActual={saldoVisual}
            />

            <EliminarClienteModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                nombreCliente={cliente.nombre}
            />
        </td>
    </tr>
  );
}