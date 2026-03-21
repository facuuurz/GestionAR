import { useState, useCallback } from "react";
import { obtenerClientes } from "@/actions/cuentas-corrientes"; 

// Tipamos los filtros para que coincidan con lo que espera el Server Action
interface FiltrosClientes {
  query?: string;
  estado?: string;
  minSaldo?: string;
  maxSaldo?: string;
  sort?: string;
  page?: number;
}

export function useClientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usamos useCallback para que el orquestador pueda llamarlo en sus useEffects sin crear loops infinitos
  const recargar = useCallback(async (filtros?: FiltrosClientes) => {
    setLoading(true);
    setError(null); // Reseteamos posibles errores previos

    try {
      // Llamamos a la Action pasándole el objeto de filtros
      const data = await obtenerClientes(filtros); 

      if (data.error) {
        throw new Error(data.error);
      }

      setClientes(data.clientes || []);
      setTotalPages(data.totalPages || 1);
      if (data.isAdmin !== undefined) setIsAdmin(data.isAdmin);
      
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setError("No se pudo conectar con el servidor de cuentas corrientes.");
      setClientes([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clientes,
    loading,
    totalPages,
    isAdmin,
    error,
    recargar,
  };
}