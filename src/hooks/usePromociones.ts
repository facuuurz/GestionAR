import { useState, useCallback } from "react";
import { obtenerPromociones } from "@/actions/promociones";

interface OpcionesPromocion {
  query?: string;
  page?: number;
  soloActivas?: boolean;
}

export function usePromociones() {
  const [promociones, setPromociones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  // NUEVO: Estado de error
  const [error, setError] = useState<string | null>(null); 

  const recargar = useCallback(async (opciones?: OpcionesPromocion) => {
    setLoading(true);
    setError(null); // Limpiamos el error antes de buscar
    try {
      const q = opciones?.query || "";
      const page = opciones?.page || 1;
      const activas = opciones?.soloActivas || false;

      const data = await obtenerPromociones(q, activas, page); 
      
      setPromociones(data.promociones);
      setTotalPages(data.totalPages);
      if (data.isAdmin !== undefined) setIsAdmin(data.isAdmin);
    } catch (err) {
      console.error("Error recargando promociones:", err);
      setError("No se pudo conectar con el servidor de promociones."); // Seteamos el error
      setPromociones([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    promociones,
    loading,
    totalPages,
    isAdmin,
    error,
    recargar
  };
}