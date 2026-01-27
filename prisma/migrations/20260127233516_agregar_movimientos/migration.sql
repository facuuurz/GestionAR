-- CreateTable
CREATE TABLE "movimientos" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descripcion" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "tipo" TEXT NOT NULL,
    "cuentaCorrienteId" INTEGER NOT NULL,

    CONSTRAINT "movimientos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_cuentaCorrienteId_fkey" FOREIGN KEY ("cuentaCorrienteId") REFERENCES "Cuentas_corrientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
