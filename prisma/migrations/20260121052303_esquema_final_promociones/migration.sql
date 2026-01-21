-- CreateTable
CREATE TABLE "PromocionProducto" (
    "promocionId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,

    CONSTRAINT "PromocionProducto_pkey" PRIMARY KEY ("promocionId","productoId")
);

-- AddForeignKey
ALTER TABLE "PromocionProducto" ADD CONSTRAINT "PromocionProducto_promocionId_fkey" FOREIGN KEY ("promocionId") REFERENCES "Promocion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromocionProducto" ADD CONSTRAINT "PromocionProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
