import { useState, useMemo, useEffect } from "react";
import { obtenerClientes } from "@/actions/clientes"; 

export function useClientes() {
  const [clientesBase, setClientesBase] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [criterioOrden, setCriterioOrden] = useState("");

  useEffect(() => {
    recargar();
  }, []);

  async function recargar() {
    setLoading(true);
    // Asumimos que obtenerClientes sin params devuelve todo, 
    // o pasamos strings vacíos si es necesario para traer la lista completa
    const datos = await obtenerClientes("", ""); 
    setClientesBase(datos);
    setLoading(false);
  }

  const clientesOrdenados = useMemo(() => {
    let ordenados = [...clientesBase];
    if (!criterioOrden) return ordenados;

    ordenados.sort((a, b) => {
      switch (criterioOrden) {
        case "nombre-asc": return a.nombre.localeCompare(b.nombre);
        case "nombre-desc": return b.nombre.localeCompare(a.nombre);
        case "saldo-desc": return Number(b.saldo) - Number(a.saldo); // Mayor deuda/saldo
        case "saldo-asc": return Number(a.saldo) - Number(b.saldo); // Menor deuda/saldo
        default: return 0;
      }
    });
    return ordenados;
  }, [clientesBase, criterioOrden]);

  return {
    clientes: clientesOrdenados,
    loading,
    recargar,
    setCriterioOrden, 
  };
}