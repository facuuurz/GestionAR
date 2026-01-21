"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// 1. Esquema de Validación
const clienteSchema = z.object({
  nombre: z.string().min(1, "El nombre del cliente es obligatorio").trim(),
  
  cuit: z.string()
    .trim()
    .min(1, "El CUIT/CUIL es obligatorio")
    .regex(/^\d{2}-\d{7,8}-\d{1}$/, {
      message: "Formato de CUIT/CUIL inválido (ej: 20-8954756-5)"
    }),
  
  telefono: z.string()
    .trim()
    .min(1, "El teléfono es obligatorio")
    .refine((val) => /^\+?[0-9]+$/.test(val), {
      message: "Solo números (ej: 112233) o + al inicio",
    }),
  
  email: z.string()
    .trim()
    .min(1, "El correo electrónico es obligatorio")
    .email("El formato del email no es válido"),
    
  direccion: z.string().trim().optional().or(z.literal("")), 

  saldo: z.coerce.number().optional(),
});

// 2. Definición del Estado
export type State = {
  errors?: {
    nombre?: string[];
    cuit?: string[];
    telefono?: string[];
    email?: string[];
    direccion?: string[];
    saldo?: string[];
  };
  message?: string | null;
  payload?: any;
};

// --- OBTENER TODOS LOS CLIENTES ---
export async function obtenerClientes(query: string = "", sort: string = "") {
  try {
    let orderBy: any = { id: 'desc' };

    switch (sort) {
      case "nombre-asc": orderBy = { nombre: 'asc' }; break;
      case "nombre-desc": orderBy = { nombre: 'desc' }; break;
      case "saldo-mayor": orderBy = { saldo: 'desc' }; break;
      case "saldo-menor": orderBy = { saldo: 'asc' }; break;
      case "antiguos": orderBy = { createdAt: 'asc' }; break;
    }

    const clientesRaw = await prisma.cuenta_corriente.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { cuit: { contains: query } },
        ],
      },
      orderBy: orderBy,
    });

    const clientes = clientesRaw.map((cliente) => ({
      ...cliente,
      saldo: cliente.saldo.toNumber(), 
    }));

    return clientes;
  } catch (error) {
    console.error("Error al obtener cuentas:", error);
    return [];
  }
}

// --- CREAR CLIENTE (CORREGIDO) ---
export async function crearCliente(prevState: State, formData: FormData) {
  const rawData = {
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    telefono: formData.get("telefono"),
    email: formData.get("email"),
    direccion: formData.get("direccion"),
    saldo: formData.get("saldo"),
  };

  const validatedFields = clienteSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación",
      payload: rawData,
    };
  }

  try {
    const saldoInicial = validatedFields.data.saldo ?? 0;
    const estadoInicial = saldoInicial < 0 ? "Deudor" : "Al Día";

    await prisma.cuenta_corriente.create({
      data: {
        nombre: validatedFields.data.nombre,
        cuit: validatedFields.data.cuit,
        telefono: validatedFields.data.telefono,
        email: validatedFields.data.email,
        direccion: validatedFields.data.direccion || null,
        saldo: saldoInicial,
        estado: estadoInicial
      },
    });

  } catch (error) {
    console.error("Error al crear cuenta:", error);
    // Si el error es de base de datos (ej: CUIT duplicado), devolvemos el error.
    return {
      message: "Error de base de datos. Verifique que el CUIT no esté duplicado.",
      payload: rawData,
    };
  }

  // ✅ CORRECCIÓN IMPORTANTE:
  // revalidatePath y redirect deben estar FUERA del bloque try/catch
  revalidatePath("/cuentas-corrientes");
  redirect("/cuentas-corrientes");
}

// --- ACTUALIZAR CLIENTE (CORREGIDO) ---
export async function actualizarCliente(id: number, prevState: State, formData: FormData) {
  const rawData = {
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    telefono: formData.get("telefono"),
    email: formData.get("email"),
    direccion: formData.get("direccion"),
    saldo: formData.get("saldo"),
  };

  const validatedFields = clienteSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación",
      payload: rawData,
    };
  }

  try {
    const nuevoSaldo = validatedFields.data.saldo ?? 0;
    const nuevoEstado = nuevoSaldo < 0 ? "Deudor" : "Al Día";

    await prisma.cuenta_corriente.update({
      where: { id },
      data: {
        nombre: validatedFields.data.nombre,
        cuit: validatedFields.data.cuit,
        telefono: validatedFields.data.telefono,
        email: validatedFields.data.email,
        direccion: validatedFields.data.direccion || null,
        saldo: nuevoSaldo,
        estado: nuevoEstado,
      },
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    return {
      message: "No se pudo actualizar la cuenta.",
      payload: rawData,
    };
  }

  // ✅ CORRECCIÓN: Redirect fuera del try/catch
  revalidatePath("/cuentas-corrientes");
  revalidatePath(`/cuentas-corrientes/${id}`);
  redirect("/cuentas-corrientes");
}

// --- OBTENER CLIENTE INDIVIDUAL ---
export async function obtenerClientePorId(id: number) {
  try {
    const cuenta = await prisma.cuenta_corriente.findUnique({
      where: { id },
    });

    if (!cuenta) return null;

    return {
      ...cuenta,
      saldo: cuenta.saldo.toNumber(),
    };

  } catch (error) {
    console.error("Error al obtener cliente:", error);
    return null;
  }
}

// --- ELIMINAR CLIENTE (CORREGIDO) ---
export async function eliminarCliente(id: number) {
  try {
    await prisma.cuenta_corriente.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    throw new Error("No se pudo eliminar");
  }

  // ✅ CORRECCIÓN: Redirect fuera del try/catch
  revalidatePath("/cuentas-corrientes");
  redirect("/cuentas-corrientes");
}