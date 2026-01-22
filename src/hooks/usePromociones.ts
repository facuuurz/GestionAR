import { useState, useEffect, useMemo } from "react";
import { obtenerPromociones } from "@/actions/promociones";

export function usePromociones() {
  const [promocionesBase, setPromocionesBase] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargamos los datos al montar el componente
  useEffect(() => {
    recargar();
  }, []);

  async function recargar() {
    setLoading(true);
    // Traemos TODAS las promociones (query vacía) para filtrar en cliente
    const datos = await obtenerPromociones(""); 
    setPromocionesBase(datos);
    setLoading(false);
  }

  return {
    promociones: promocionesBase,
    loading,
    recargar
  };
}