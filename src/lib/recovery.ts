"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function submitRecovery(email: string, role: string) {
  // Buscar si el usuario existe (opcional, pero buena práctica)
  const user = await (prisma.user as any).findUnique({
    where: { email }
  });

  if (!user) {
    return { error: "No se encontró un usuario con este correo." };
  }

  if (role === "EMPLEADO") {
    // Disparar notificación interna a la campanita del Admin
    await (prisma as any).notification.create({
      data: {
        message: `El empleado ${user.name || user.username} (${user.email}) ha solicitado restablecer su contraseña.`,
      }
    });

    return { 
      success: true, 
      message: "Su caso llegará al buzón de un administrador, favor de esperar, esto puede tardar un poco..." 
    };

  } else if (role === "ADMIN") {
    // Si fuera real, usaríamos Resend o Nodemailer aquí:
    console.log(`[EMAIL ENVIADO A gestionarsoportear@gmail.com]`);
    console.log(`Asunto: Restablecimiento de contraseña - ADMIN`);
    console.log(`Cuerpo: 
      Nombre: ${user.name}
      Dirección del local: ${user.address}
      Su email: ${user.email}
      Nombre de local: ${user.localName}
      Teléfono: ${user.phone}`);

    return {
      success: true,
      message: "Se envió su petición a soporte gestionarsoportear@gmail.com. Pronto se pondrán en contacto con usted, ¡Gracias por esperar!"
    };
  }

  return { error: "Rol no válido." };
}
