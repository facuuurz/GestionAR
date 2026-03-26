import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: "Mgervasoni", mode: "insensitive" } },
        { email: { contains: "fthomasxx", mode: "insensitive" } },
      ],
    },
    select: { id: true, username: true, email: true, role: true },
  });

  console.log("Usuarios encontrados:");
  users.forEach(u => {
    console.log(`  ID=${u.id} | username="${u.username}" | email="${u.email}" | role=${u.role}`);
    console.log(`    username bytes: [${[...u.username].map(c => c.charCodeAt(0)).join(", ")}]`);
    console.log(`    email bytes:    [${[...u.email].map(c => c.charCodeAt(0)).join(", ")}]`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
