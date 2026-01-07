import { useState, useMemo, useEffect } from "react";
import { obtenerProductosDB, cargarDatosDePrueba } from "@/actions/productos";

// Definimos el tipo aquí o impórtalo si lo tienes en otro lado
type Producto = {
  id: number;
  nombre: string;
  codigoBarra: string | null;
  tipo: string | null;
  proveedor: string | null;
  stock: number;
  precio: number;
  createdAt: Date;
  updatedAt: Date;
};

// Aceptamos "datosIniciales" para que no falle la llamada en page.tsx
export function useProductos(datosIniciales: any[] = []) {
  const [productosBase, setProductosBase] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [criterioOrden, setCriterioOrden] = useState("");

  useEffect(() => {
    recargar();
  }, []);

  async function recargar() {
    setLoading(true);
    const datos = await obtenerProductosDB();
    setProductosBase(datos);
    setLoading(false);
  }

  async function generarDatosPrueba() {
    setLoading(true);
    await cargarDatosDePrueba();
    await recargar();
  }

  // Lógica de ordenamiento
  const productosOrdenados = useMemo(() => {
    let ordenados = [...productosBase];
    if (!criterioOrden) return ordenados;

    ordenados.sort((a, b) => {
      switch (criterioOrden) {
        case "nombre-asc": return a.nombre.localeCompare(b.nombre);
        case "nombre-desc": return b.nombre.localeCompare(a.nombre);
        case "stock-desc": return b.stock - a.stock;
        case "stock-asc": return a.stock - b.stock;
        case "precio-desc": return b.precio - a.precio;
        case "precio-asc": return a.precio - b.precio;
        default: return 0;
      }
    });
    return ordenados;
  }, [productosBase, criterioOrden]);

  return {
    productos: productosOrdenados,
    loading,
    recargar,
    generarDatosPrueba,
    setCriterioOrden, // ¡Esto soluciona el error en page.tsx!
  };
}