"use server";

import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { generateResetToken } from "@/lib/resetPassword";

const prisma = new PrismaClient();

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function submitRecovery(email: string, role: string) {
  const user = await (prisma.user as any).findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "No se encontró un usuario con este correo." };
  }

  if (role === "EMPLEADO") {
    await (prisma as any).notification.create({
      data: {
        message: `El empleado ${user.name || user.username} (${user.email}) ha solicitado restablecer su contraseña.`,
      },
    });

    return {
      success: true,
      message: "Su caso llegará al buzón de un administrador, favor de esperar, esto puede tardar un poco...",
    };
  }

  if (role === "ADMIN") {
    try {
      const transporter = createTransporter();

      const subject = `Restablecer contraseña - ${user.dni ?? "Sin DNI"}`;

      // Generar link secreto de reseteo (válido 24h)
      const resetToken = await generateResetToken(user.email);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #111827; margin-bottom: 4px;">🔐 Solicitud de Restablecimiento de Contraseña</h2>
          <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Un administrador ha solicitado restablecer su contraseña en GestionAR.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #6b7280; width: 180px;">Nombre completo</td><td style="padding: 8px 0; color: #111827; font-weight: 500;">${user.name ?? "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">DNI</td><td style="padding: 8px 0; color: #111827; font-weight: 500;">${user.dni ?? "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">CUIT / CUIL</td><td style="padding: 8px 0; color: #111827; font-weight: 500;">${user.cuit ?? "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Nombre del Local</td><td style="padding: 8px 0; color: #111827; font-weight: 500;">${user.localName ?? "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Dirección del Local</td><td style="padding: 8px 0; color: #111827; font-weight: 500;">${user.address ?? "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Teléfono</td><td style="padding: 8px 0; color: #111827; font-weight: 500;">${user.phone ?? "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Nombre de usuario</td><td style="padding: 8px 0; color: #111827; font-weight: 500;">${user.username ?? "—"}</td></tr>
            <tr><td style="padding: 8px 0; color: #6b7280;">Correo</td><td style="padding: 8px 0; color: #111827; font-weight: 500;">${user.email ?? "—"}</td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #111827; font-size: 14px; font-weight: 600; margin-bottom: 8px;">🔗 Link para restablecer la contraseña (válido 24 hs):</p>
          <p style="color: #6b7280; font-size: 12px; word-break: break-all;">${resetUrl}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">Este correo fue generado automáticamente por el sistema GestionAR.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"GestionAR" <${process.env.GMAIL_USER}>`,
        to: "gestionarsoportear@gmail.com",
        subject,
        html,
      });

      return {
        success: true,
        message: "Se envió su petición a soporte gestionarsoportear@gmail.com. Pronto se pondrán en contacto con usted, ¡Gracias por esperar!",
      };
    } catch (error) {
      console.error("[RECOVERY EMAIL ERROR]", error);
      return { error: "Hubo un error al enviar el correo de soporte. Intente nuevamente." };
    }
  }

  return { error: "Rol no válido." };
}
