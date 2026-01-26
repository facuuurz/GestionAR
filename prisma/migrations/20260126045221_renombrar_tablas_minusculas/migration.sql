/*
  Warnings:

  - You are about to drop the `Promocion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PromocionProducto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PromocionProducto" DROP CONSTRAINT "PromocionProducto_productoId_fkey";

-- DropForeignKey
ALTER TABLE "PromocionProducto" DROP CONSTRAINT "PromocionProducto_promocionId_fkey";

-- DropTable
DROP TABLE "Promocion";

-- DropTable
DROP TABLE "PromocionProducto";

-- CreateTable
CREATE TABLE "promociones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promocion_productos" (
    "promocionId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "promocion_productos_pkey" PRIMARY KEY ("promocionId","productoId")
);

-- AddForeignKey
ALTER TABLE "promocion_productos" ADD CONSTRAINT "promocion_productos_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "promociones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocion_productos" ADD CONSTRAINT "promocion_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
