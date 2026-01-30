import { useState, useEffect, useCallback } from "react";
// Asegúrate de que la ruta sea correcta
import { obtenerProductosDB, cargarDatosDePrueba } from "@/actions/productos"; 

// 1. Actualizamos el tipo para incluir la fecha
export type Producto = {
  id: number;
  nombre: string;
  codigoBarra: string | null;
  tipo: string | null;
  proveedor: string | null;
  stock: number;
  precio: number;
  descripcion: string | null;
  fechaVencimiento: Date | string | null; // 🆕 Nuevo campo
  createdAt: Date;
  updatedAt: Date;
};

// Definimos la forma de los filtros que acepta el hook
type FiltrosHook = {
  query?: string;
  category?: string;
  stockStatus?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
};

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Función para cargar datos (ahora acepta filtros)
  // Usamos useCallback para que no se re-cree en cada render
  const recargar = useCallback(async (filtros?: FiltrosHook) => {
    setLoading(true);
    try {
      // Llamamos al Server Action pasando los filtros
      const datos = await obtenerProductosDB(filtros);
      setProductos(datos as any); // 'as any' por si hay conflicto de tipos con Decimal/Number
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial (sin filtros)
  useEffect(() => {
    recargar();
  }, [recargar]);

  async function generarDatosPrueba() {
    setLoading(true);
    await cargarDatosDePrueba();
    await recargar();
  }

  // 3. Ya no necesitamos 'useMemo' para ordenar ni 'criterioOrden' como estado local,
  // porque el servidor nos devuelve la lista ya ordenada y filtrada.

  return {
    productos, // Devolvemos directo el estado
    loading,
    recargar, // Esta función ahora es la clave para filtrar/ordenar
    generarDatosPrueba,
  };
}