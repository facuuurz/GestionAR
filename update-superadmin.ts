import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const superAdmin = await prisma.user.findFirst({
    where: { role: 'SUPERADMIN' }
  });

  if (!superAdmin) {
    console.log("No existe un usuario SUPERADMIN.");
    return;
  }

  console.log("--- DATOS DEL SUPER ADMIN ---");
  console.log(`Usuario: ${superAdmin.username}`);
  console.log(`Email: ${superAdmin.email}`);
  console.log(`Nombre: ${superAdmin.name || 'N/A'}`);
  console.log("----------------------------");

  const newPassword = "Facundo2003$";
  // Generar el hash de la nueva contraseña
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: superAdmin.id },
    data: { passwordHash }
  });

  console.log(`La contraseña ha sido actualizada con éxito a: ${newPassword}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
