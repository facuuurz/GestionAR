import { useState, useMemo } from "react";

export function useProductos(productosIniciales: any[]) {
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
}