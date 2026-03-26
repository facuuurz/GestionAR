import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('Gestionar2026$', 10);
  
  const result = await prisma.user.updateMany({
    data: { passwordHash: hash }
  });
  
  console.log(`Successfully updated ${result.count} users' passwords!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
