// src/lib/prisma.ts
import { PrismaClient } from "../app/generated/prisma/client" // ✅ Tu ruta personalizada
import { PrismaPg } from "@prisma/adapter-pg" // ✅ Tu adaptador

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 👇 CAMBIO 1: Agregamos "export" aquí
export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// 👇 CAMBIO 2: Borramos la línea "export default prisma" que había aquí