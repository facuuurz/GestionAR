import { useState, useMemo, useEffect } from "react";
import { obtenerProductosDB, cargarDatosDePrueba } from "@/actions/productos";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  stock: number;
  precio: number;
  tipo: string;
};

/*export function useProductos(productosIniciales: any[]) {
  const [criterioOrden, setCriterioOrden] = useState("nombre-asc");

  const productosOrdenados = useMemo(() => {
    // copia para no afectar el array original
    let ordenados = [...productosIniciales];

    return ordenados.sort((a, b) => {
      // Helpers para limpiar datos
      const limpiarPrecio = (p: string) => parseFloat(p.replace("$", "").replace(".", "").replace(",", "."));
      const limpiarStock = (s: string) => parseInt(s.replace(" un.", ""));

      switch (criterioOrden) {
        case "nombre-asc":
          return a.nombre.localeCompare(b.nombre);
        
        case "stock-desc":
          return limpiarStock(b.stock) - limpiarStock(a.stock);
        
        case "stock-asc":
          return limpiarStock(a.stock) - limpiarStock(b.stock);
        
        case "precio-desc":
          return limpiarPrecio(b.precio) - limpiarPrecio(a.precio);

        case "precio-asc":
          return limpiarPrecio(a.precio) - limpiarPrecio(b.precio);
        
        default:
          return 0;
      }
    });
  }, [criterioOrden, productosIniciales]);

  return {
    productos: productosOrdenados, // lista ya ordenada
    criterioOrden,                 // criterio actual
    setCriterioOrden               // función para cambiar el orden
  };
}*/


export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos automáticamente al entrar a la página
  useEffect(() => {
    recargar();
  }, []);

  async function recargar() {
    setLoading(true);
    const datos = await obtenerProductosDB();
    // Convertimos el precio Decimal a number para evitar problemas en frontend
    const datosFormateados = datos.map(p => ({
        ...p,
        precio: Number(p.precio)
    }));
    setProductos(datosFormateados);
    setLoading(false);
  }

  async function generarDatosPrueba() {
    setLoading(true);
    await cargarDatosDePrueba();
    await recargar(); // Volvemos a leer la DB para mostrar los nuevos
  }

  return {
    productos,
    loading,
    recargar,
    generarDatosPrueba
  };
}