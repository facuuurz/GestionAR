-- DropIndex
DROP INDEX "productos_codigo_barra_key";

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "fecha_vencimiento" DATE;

-- CreateIndex
CREATE INDEX "productos_codigo_barra_fecha_vencimiento_idx" ON "productos"("codigo_barra", "fecha_vencimiento");
