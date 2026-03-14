"use server";

import { SignJWT, jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { validatePasswordStrength } from "@/lib/passwordUtils";

const prisma = new PrismaClient();

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET no está definido en .env.local");
  return new TextEncoder().encode(secret);
}

/** Genera un token JWT firmado que expira en 24 horas para el email dado. */
export async function generateResetToken(email: string): Promise<string> {
  const secret = getSecret();
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
  return token;
}

/** Verifica el token y actualiza la contraseña del usuario en la BD. */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ success?: boolean; message?: string; error?: string }> {
  try {
    // 1. Verificar token JWT
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;
    if (!email) return { error: "Token inválido." };

    // 2. Buscar usuario
    const user = await (prisma.user as any).findUnique({
      where: { email },
      include: { passwordHistory: { orderBy: { createdAt: "desc" }, take: 5 } },
    });
    if (!user) return { error: "No se encontró el usuario asociado a este enlace." };

    // 3. Validar fortaleza
    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) return { error: strengthError };

    // 4. Verificar que no sea igual a la contraseña actual
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSameAsCurrent) {
      return { error: "La nueva contraseña no puede ser igual a la contraseña actual." };
    }

    // 5. Verificar historial (últimas 5 contraseñas)
    for (const entry of user.passwordHistory) {
      const usedBefore = await bcrypt.compare(newPassword, entry.passwordHash);
      if (usedBefore) {
        return { error: "Ya usaste esta contraseña anteriormente. Por seguridad, elegí una diferente." };
      }
    }

    // 6. Guardar contraseña actual en historial antes de actualizar
    await (prisma as any).passwordHistory.create({
      data: { userId: user.id, passwordHash: user.passwordHash },
    });

    // 7. Mantener solo las últimas 5 entradas en historial
    const historyEntries = await (prisma as any).passwordHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (historyEntries.length > 5) {
      const toDelete = historyEntries.slice(5).map((e: any) => e.id);
      await (prisma as any).passwordHistory.deleteMany({ where: { id: { in: toDelete } } });
    }

    // 8. Actualizar contraseña
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await (prisma.user as any).update({
      where: { email },
      data: { passwordHash },
    });

    return {
      success: true,
      message: "¡Contraseña actualizada correctamente! Ya podés iniciar sesión.",
    };
  } catch (err: any) {
    if (err?.code === "ERR_JWT_EXPIRED") {
      return { error: "El enlace ha expirado. Solicitá uno nuevo." };
    }
    console.error("[RESET PASSWORD ERROR]", err);
    return { error: "El enlace es inválido o ya fue utilizado." };
  }
}
