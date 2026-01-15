-- CreateTable
CREATE TABLE "Cuentas_corrientes" (
    "id" SERIAL NOT NULL,
    "razon_social" TEXT NOT NULL,
    "cuit" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "direccion" TEXT,
    "saldo" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "estado" TEXT NOT NULL DEFAULT 'Al Día',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cuentas_corrientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuentas_corrientes_cuit_key" ON "Cuentas_corrientes"("cuit");
