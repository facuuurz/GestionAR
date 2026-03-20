"use client";

import { useState } from "react";

interface ProductoExport {
  nombre: string;
  sku: string;
  cantidad: string;
  precioUnitario: string;
  precioPromocional: string | null;
  subtotal: string;
}

interface DatosVentaExport {
  idVisual: string;
  fecha: string;
  hora: string;
  cliente: string;
  productos: ProductoExport[];
  totalFinal: string;
}

interface Props {
  venta: DatosVentaExport;
}

export default function BotonExportarVenta({ venta }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      // Importamos xlsx dinámicamente para no aumentar el bundle del servidor
      const XLSX = await import("xlsx");

      // Determinar tipo de cliente
      const esConsumidorFinal = venta.cliente === "Consumidor Final";
      const tipoCliente = esConsumidorFinal ? "Consumidor Final" : "Cuenta Corriente";

      // Construimos la hoja como array de arrays para poder mezclar secciones
      const aoa: (string | number)[][] = [
        // === ENCABEZADO DE LA VENTA ===
        ["DETALLE DE VENTA"],
        [],
        ["ID Venta",    venta.idVisual],
        ["Fecha",       `${venta.fecha} ${venta.hora}`],
        ["Cliente",     venta.cliente],
        ["Tipo",        tipoCliente],
        ["Total Final", venta.totalFinal],
        [],
        // === TABLA DE PRODUCTOS ===
        ["Producto", "SKU / Cód. Barra", "Cantidad", "Precio de Lista", "Precio Cobrado", "Subtotal"],
      ];

      for (const prod of venta.productos) {
        aoa.push([
          prod.nombre,
          prod.sku,
          prod.cantidad,
          prod.precioUnitario,
          prod.precioPromocional ?? prod.precioUnitario,
          prod.subtotal,
        ]);
      }

      const ws = XLSX.utils.aoa_to_sheet(aoa);

      // Ancho de columnas
      ws["!cols"] = [
        { wch: 30 }, // col A
        { wch: 32 }, // col B
        { wch: 14 }, // col C
        { wch: 18 }, // col D
        { wch: 18 }, // col E
        { wch: 16 }, // col F
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Detalle de Venta");

      const nombreArchivo = `venta_${venta.idVisual.replace("#", "")}_${venta.fecha.replace(/\//g, "-")}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    } catch (err) {
      console.error("Error al exportar a Excel:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="px-5 h-11 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 border border-emerald-700 rounded-lg text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
    >
      <span className="material-symbols-outlined text-lg">
        {loading ? "hourglass_empty" : "download"}
      </span>
      {loading ? "Exportando..." : "Exportar Excel"}
    </button>
  );
}
