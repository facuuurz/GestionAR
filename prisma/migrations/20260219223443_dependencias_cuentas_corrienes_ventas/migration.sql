-- AlterTable
ALTER TABLE "ventas" ADD COLUMN     "cuenta_corriente_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ventas" ADD CONSTRAINT "ventas_cuenta_corriente_id_fkey" FOREIGN KEY ("cuenta_corriente_id") REFERENCES "Cuentas_corrientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
