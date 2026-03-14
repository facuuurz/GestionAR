// Utilidades de contraseña — usable tanto en server como en client
// Este archivo NO tiene "use server" para no forzar async en funciones síncronas.

export const PASSWORD_RULES = [
  { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Una letra mayúscula (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un número (0-9)", test: (p: string) => /[0-9]/.test(p) },
  {
    label: "Un símbolo especial ($, @, #, !...)",
    test: (p: string) => /[^A-Za-z0-9]/.test(p),
  },
];

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "La contraseña debe contener al menos una letra mayúscula.";
  if (!/[0-9]/.test(password)) return "La contraseña debe contener al menos un número (0-9).";
  if (!/[^A-Za-z0-9]/.test(password))
    return "La contraseña debe contener al menos un símbolo especial (ej: $, @, #, !).";
  return null;
}
