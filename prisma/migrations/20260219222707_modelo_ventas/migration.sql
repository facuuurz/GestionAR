-- CreateTable
CREATE TABLE "ventas" (
    "id" SERIAL NOT NULL,
    "codigo_venta" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cliente" TEXT NOT NULL DEFAULT 'Consumidor Final',
    "metodo_pago" TEXT NOT NULL,
    "monto_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ventas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_ventas" (
    "id" SERIAL NOT NULL,
    "venta_id" INTEGER NOT NULL,
    "producto_id" INTEGER,
    "nombre" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "es_promo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ventas_codigo_venta_key" ON "ventas"("codigo_venta");

-- AddForeignKey
ALTER TABLE "detalle_ventas" ADD CONSTRAINT "detalle_ventas_venta_id_fkey" FOREIGN KEY ("venta_id") REFERENCES "ventas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
