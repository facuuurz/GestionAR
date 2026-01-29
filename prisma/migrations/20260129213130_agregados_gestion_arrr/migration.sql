/*
  Warnings:

  - You are about to alter the column `precio` on the `promociones` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "promociones" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "precio" SET DATA TYPE DECIMAL(65,30);
