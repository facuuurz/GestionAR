import { defineConfig } from '@prisma/config';
import 'dotenv/config'; // 👈 Importante

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL, // 👈 Ahora lee del archivo .env
  },
});