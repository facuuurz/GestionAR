-- DropForeignKey
ALTER TABLE "detalle_ventas" DROP CONSTRAINT "detalle_ventas_productoId_fkey";

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id_producto") ON DELETE CASCADE ON UPDATE CASCADE;
