import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Gestionar2026$', 10);
  await prisma.user.update({
    where: { id: 2 },
    data: { passwordHash: hash }
  });
  console.log('Superadmin password updated successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
