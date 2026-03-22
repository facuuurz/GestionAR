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
  vendedor: string;
  productos: ProductoExport[];
  totalFinal: string;
}

interface Props {
  venta: DatosVentaExport;
}

export default function BotonExportarPDF({ venta }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
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

      venta.productos.forEach(prod => {
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
      console.error("Error al exportar a PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="px-5 h-11 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 border border-rose-700 rounded-lg text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
    >
      <span className="material-symbols-outlined text-lg">
        {loading ? "hourglass_empty" : "picture_as_pdf"}
      </span>
      {loading ? "Generando..." : "Exportar PDF"}
    </button>
  );
}
