import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Buscar todos los usuarios con espacios en el username
  const users = await prisma.user.findMany({
    where: {
      username: { contains: " " },
    },
    select: { id: true, username: true, email: true },
  });

  if (users.length === 0) {
    console.log("✅ No se encontraron usuarios con espacios en el username.");
    return;
  }

  console.log(`🔍 Se encontraron ${users.length} usuario(s) con espacios en el username:\n`);

  for (const user of users) {
    const trimmed = user.username.trim();
    console.log(`  ID ${user.id} | "${user.username}" → "${trimmed}" (email: ${user.email})`);

    // Verificar si ya existe otro usuario con el username trimmeado
    const conflict = await prisma.user.findFirst({
      where: {
        username: { equals: trimmed, mode: "insensitive" },
        NOT: { id: user.id },
      },
    });

    if (conflict) {
      console.log(`  ⚠️  CONFLICTO: Ya existe el usuario ID ${conflict.id} con username "${conflict.username}". Eliminando el duplicado con espacio (ID ${user.id})...`);
      await prisma.user.delete({ where: { id: user.id } });
      console.log(`  🗑️  Usuario ID ${user.id} eliminado.`);
    } else {
      console.log(`  ✏️  Actualizando username a "${trimmed}"...`);
      await prisma.user.update({
        where: { id: user.id },
        data: { username: trimmed },
      });
      console.log(`  ✅  Actualizado.`);
    }
  }

  console.log("\n🏁 Migración completada.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
