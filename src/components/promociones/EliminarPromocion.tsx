"use client";

import { eliminarPromocion } from "@/actions/promociones";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EliminarPromocion({ id }: { id: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer.")) {
      setIsDeleting(true);
      try {
        
          await eliminarPromocion(id, new FormData()); 
          
          router.push("/promociones");
          router.refresh();
      } catch (error) {
          console.error("Error al eliminar", error);
          setIsDeleting(false);
          alert("Ocurrió un error al eliminar la promoción.");
      }
    }
  };
  
  // Si prefieres usar un formulario para ser consistente con Server Actions:
  const eliminarPromocionConId = eliminarPromocion.bind(null, id);

  return (
    <form action={eliminarPromocionConId} onSubmit={(e) => {
        if (!confirm("¿Estás seguro de eliminar esta promoción?")) {
            e.preventDefault();
        }
    }}>
        <button 
          type="submit"
          disabled={isDeleting}
          className="flex items-center justify-center gap-2 bg-white border border-red-600 text-red-600 text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          <span>{isDeleting ? "Eliminando..." : "Eliminar Promoción"}</span>
        </button>
    </form>
  );
}