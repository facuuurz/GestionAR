import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { eliminarPromocion } from "@/actions/promociones";
import EliminarPromocionModal from "@/components/promociones/Modal/EliminarPromocionModal";

interface PromocionRowProps {
  promo: any;
  onDeleteSuccess?: () => void;
  isAdmin: boolean;
}

export default function PromocionRow({ promo, onDeleteSuccess, isAdmin }: PromocionRowProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: Date | string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(date);
  };

  const getEstadoPromocion = (activo: boolean, inicio: Date | string, fin: Date | string) => {

    // 1. Prioridad máxima: Lo que diga la Base de Datos
    if (!activo) {
      return {
        label: "Inactiva",
        badgeColor: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
        btnText: "Activar",
        btnIcon: "power_settings_new",
        btnColor: "bg-neutral-800 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      };
    }

    // 2. Si está activa en la BD, calculamos el estado por las fechas
    const hoy = new Date();
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);

    if (hoy > fechaFin) {
      return {
        label: "Vencida",
        badgeColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        btnText: "Reactivar",
        btnIcon: "restore",
        btnColor: "bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
      };
    } else if (hoy < fechaInicio) {
      return {
        label: "Programada",
        badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        btnText: "Actualizar",
        btnIcon: "edit",
        btnColor: "bg-neutral-800 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      };
    } else {
      return {
        label: "Activa",
        badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        btnText: "Actualizar",
        btnIcon: "edit",
        btnColor: "bg-neutral-800 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      };
    }
  };

  const estado = getEstadoPromocion(promo.activo, promo.fechaInicio, promo.fechaFin);

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await eliminarPromocion(promo.id);
      setIsDeleting(false);
      setShowDeleteModal(false);
      toast.success("Promoción eliminada correctamente");
      if (onDeleteSuccess) onDeleteSuccess();
      router.refresh();
    } catch (error: any) {
      setIsDeleting(false);
      setShowDeleteModal(false);

      if (error.message === "NEXT_REDIRECT") {
        toast.success("Promoción eliminada correctamente");
        if (onDeleteSuccess) onDeleteSuccess();
        router.refresh();
        throw error;
      }
      console.error(error);
      toast.error("Error al eliminar la promoción");
    }
  };

  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">

      {/* NOMBRE */}
      <td className="px-4 py-3">
        <Link
          href={`/promociones/${promo.id}`}
          className="text-sm font-bold text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline hover:underline-offset-2 transition-colors block truncate max-w-[200px]"
          title={promo.nombre}
        >
          {promo.nombre}
        </Link>
      </td>

      {/* DESCRIPCIÓN */}
      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">
        <span className="block truncate max-w-[250px]" title={promo.descripcion}>
          {promo.descripcion}
        </span>
      </td>

      {/* PRECIO */}
      <td className="px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">
        {formatCurrency(promo.precio)}
      </td>

      {/* VIGENCIA */}
      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 font-mono hidden md:table-cell">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="material-symbols-outlined text-[16px] opacity-70">calendar_today</span>
          {formatDate(promo.fechaInicio)} <span className="text-neutral-300 dark:text-neutral-600">-</span> {formatDate(promo.fechaFin)}
        </div>
      </td>

      {/* ESTADO */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${estado.badgeColor}`}>
          {estado.label}
        </span>
      </td>

      {/* ACCIONES */}
      {isAdmin && (
        <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-neutral-50 dark:bg-[#151a25] dark:group-hover:bg-[#1a222e] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/promociones/editar/${promo.id}`}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm max-w-[110px] ${estado.btnColor}`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {estado.btnIcon}
              </span>
              {estado.btnText}
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-1.5 transition-all shadow-sm flex items-center justify-center hover:scale-105 active:scale-95"
              title="Eliminar"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
          <EliminarPromocionModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            isDeleting={isDeleting}
            nombrePromocion={promo.nombre}
          />
        </td>
      )}
    </tr>
  );
}