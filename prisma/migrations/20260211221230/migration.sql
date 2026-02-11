-- DropForeignKey
ALTER TABLE "promocion_productos" DROP CONSTRAINT "promocion_productos_productoId_fkey";

-- AddForeignKey
ALTER TABLE "promocion_productos" ADD CONSTRAINT "promocion_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id_producto") ON DELETE CASCADE ON UPDATE CASCADE;
