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
  fechaVencimiento: Date | string | null; 
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
  page?: number; // <-- NUEVO: Agregamos la página a la interfaz
};

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- NUEVOS ESTADOS ---
  const [totalPages, setTotalPages] = useState(1); // Para la paginación
  const [error, setError] = useState<string | null>(null); // Para el manejo de errores (Punto 3)

  // 2. Función para cargar datos (ahora acepta filtros y página)
  const recargar = useCallback(async (filtros?: FiltrosHook) => {
    setLoading(true);
    setError(null); // Reseteamos el error antes de cada nueva petición
    
    try {
      // Llamamos al Server Action pasando los filtros
      const datos = await obtenerProductosDB(filtros);
      
      // Ahora 'datos' es un objeto con dos propiedades
      setProductos(datos.productos as any); 
      setTotalPages(datos.totalPages); 
      
    } catch (error) {
      console.error("Error cargando productos:", error);
      setError("No se pudo conectar con el servidor de inventario."); // Mensaje amigable
      setProductos([]);
      setTotalPages(1);
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

  return {
    productos, 
    totalPages, // <-- Exportamos el total de páginas para la botonera
    error,      // <-- Exportamos el error por si la UI quiere mostrar una alerta
    loading,
    recargar, 
    generarDatosPrueba,
  };
}