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

export async function submitRecovery(email: string) {
  const user = await (prisma.user as any).findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "No se encontró un usuario con este correo." };
  }

  try {
    const transporter = createTransporter();

    const subject = `RECOVERY_REQUEST | email=${user.email} | dni=${user.dni ?? ""}`;

    // Generar link secreto de reseteo (válido 24h)
    const resetToken = await generateResetToken(user.email);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    // --------------------------------------------------
    // Texto plano: formato clave=valor para que n8n pueda
    // parsear fácilmente con un nodo Set o Function.
    // --------------------------------------------------
    const text = [
      `GESTIONAR_RECOVERY_REQUEST`,
      ``,
      `USER_EMAIL=${user.email}`,
      `RESET_URL=${resetUrl}`,
      ``,
      `--- Datos adicionales ---`,
      `nombre=${user.name ?? ""}`,
      `username=${user.username ?? ""}`,
      `dni=${user.dni ?? ""}`,
      `cuit=${user.cuit ?? ""}`,
      `telefono=${user.phone ?? ""}`,
      `local=${user.localName ?? ""}`,
      `direccion=${user.address ?? ""}`,
    ].join("\n");

    // --------------------------------------------------
    // HTML: versión visual para lectura humana
    // --------------------------------------------------
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #111827; margin-bottom: 4px;">🔐 Solicitud de Restablecimiento de Contraseña</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: 0;">Un usuario solicitó restablecer su contraseña en GestionAR.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

        <p style="color: #111827; font-size: 14px; font-weight: 600; margin-bottom: 4px;">📧 Datos para el reenvío al usuario (para n8n):</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; background: #f9fafb; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
          <tr><td style="padding: 8px 12px; color: #6b7280; width: 160px;">Email destino</td><td style="padding: 8px 12px; color: #111827; font-weight: 700;">${user.email}</td></tr>
          <tr><td style="padding: 8px 12px; color: #6b7280;">Link de reset</td><td style="padding: 8px 12px; color: #4f46e5; word-break: break-all;"><a href="${resetUrl}">${resetUrl}</a></td></tr>
        </table>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #111827; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Datos del usuario solicitante:</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 180px;">Nombre completo</td><td style="padding: 6px 0; color: #111827;">${user.name ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Usuario</td><td style="padding: 6px 0; color: #111827;">${user.username ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">DNI</td><td style="padding: 6px 0; color: #111827;">${user.dni ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">CUIT / CUIL</td><td style="padding: 6px 0; color: #111827;">${user.cuit ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Teléfono</td><td style="padding: 6px 0; color: #111827;">${user.phone ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Nombre del Local</td><td style="padding: 6px 0; color: #111827;">${user.localName ?? "—"}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Dirección</td><td style="padding: 6px 0; color: #111827;">${user.address ?? "—"}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Este correo fue generado automáticamente por GestionAR. El link expira en 24 hs.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"GestionAR" <${process.env.GMAIL_USER}>`,
      to: "gestionarsoportear@gmail.com",
      subject,
      text,   // ← texto plano con USER_EMAIL= y RESET_URL= para n8n
      html,
      headers: {
        // ← headers personalizados: n8n puede leerlos directamente
        // desde el nodo Gmail → campo "headers" del mensaje
        "X-GestionAR-Action":  "RECOVERY_REQUEST",
        "X-User-Email":         user.email,
        "X-Reset-URL":          resetUrl,
      },
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
