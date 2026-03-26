"use client";

import { useState } from "react";
import { obtenerDetalleVenta } from "@/actions/ventas";

interface Props {
  ventaId: number;
}

export default function BotonDescargaPDFTabla({ ventaId }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      const venta = await obtenerDetalleVenta(ventaId);
      if (!venta) {
        throw new Error("No se pudo obtener el detalle de la venta");
      }

      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(22);
      doc.setTextColor(40);
      doc.text("DETALLE DE VENTA", 14, 22);
      
      // Línea separadora
      doc.setDrawColor(200);
      doc.line(14, 26, 196, 26);

      doc.setFontSize(11);
      doc.setTextColor(60);
      
      // Información general
      let yPos = 38;
      doc.text(`ID Venta:`, 14, yPos);
      doc.setFont(undefined, 'bold');
      doc.text(venta.idVisual, 45, yPos);
      doc.setFont(undefined, 'normal');
      
      yPos += 8;
      doc.text(`Fecha y Hora:`, 14, yPos);
      doc.text(`${venta.fecha} ${venta.hora}`, 45, yPos);
      
      yPos += 8;
      doc.text(`Vendedor:`, 14, yPos);
      doc.text(venta.vendedor, 45, yPos);
      
      yPos += 8;
      doc.text(`Cliente:`, 14, yPos);
      doc.text(venta.cliente, 45, yPos);
      
      yPos += 8;
      doc.setFontSize(12);
      doc.setTextColor(16, 185, 129); // Emerald 600
      doc.text(`Total Final:`, 14, yPos);
      doc.setFont(undefined, 'bold');
      doc.text(venta.totalFinal, 45, yPos);
      doc.setFont(undefined, 'normal');

      // Tabla de productos
      const tableColumn = ["Producto", "SKU", "Cant.", "P. Lista", "P. Cobrado", "Subtotal"];
      const tableRows: any[] = [];

      venta.productos.forEach((prod: any) => {
        const prodData = [
          prod.nombre,
          prod.sku,
          prod.cantidad,
          prod.precioUnitario,
          prod.precioPromocional ?? prod.precioUnitario,
          prod.subtotal
        ];
        tableRows.push(prodData);
      });

      // @ts-ignore
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: yPos + 12,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
          2: { halign: 'center' }, // Cantidad
          3: { halign: 'right' },  // P. Lista
          4: { halign: 'right' },  // P. Cobrado
          5: { halign: 'right' },  // Subtotal
        }
      });

      const nombreArchivo = `venta_${venta.idVisual.replace("#", "")}_${venta.fecha.replace(/\//g, "-")}.pdf`;
      doc.save(nombreArchivo);
    } catch (err) {
      console.error("Error al descargar PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      title="Descargar PDF"
      className="p-1.5 rounded bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
    >
      <span className="material-symbols-outlined text-[18px]">
        {loading ? "hourglass_empty" : "download"}
      </span>
    </button>
  );
}
