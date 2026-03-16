import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function migrateData() {
  try {
    const admin = await prisma.user.findUnique({
      where: { username: "admin" }
    });

    if (!admin) {
      console.log("Admin user not found. Cannot migrate.");
      return;
    }

    let superAdmin = await prisma.user.findUnique({
      where: { username: "superadmin" }
    });

    if (superAdmin) {
      console.log("Superadmin user already exists. ID:", superAdmin.id);
    } else {
      console.log("Creating new SUPERADMIN user...");
      
      const newPasswordHash = await bcrypt.hash("superadmin123#", 10); 

      // Wipe out the transferred data from the original admin FIRST
      // to free up the email address.
      console.log("Clearing personal data from the original admin user...");
      await prisma.user.update({
        where: { id: admin.id },
        data: {
          name: "Administrador Base",
          email: "admin_placeholder_" + Date.now() + "@gestionar.com",
          phone: null,
          address: null,
          localName: null,
          dni: null,
          cuit: null,
          profilePicture: null
        }
      });
      
      superAdmin = await prisma.user.create({
        data: {
          username: "superadmin",
          name: "Super Admin",
          email: admin.email || "superadmin@gestionar.com",
          passwordHash: newPasswordHash, 
          profilePicture: admin.profilePicture,
          role: "SUPERADMIN",
          phone: admin.phone,
          address: admin.address,
          localName: admin.localName,
          dni: admin.dni,
          cuit: admin.cuit,
        }
      });
      console.log("Created SUPERADMIN user! ID:", superAdmin.id);
    }
    
    console.log("Migration complete!");

  } catch (err) {
    console.error("Error migrating data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
