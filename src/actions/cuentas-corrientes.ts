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
    .regex(/^\d{2}-\d{7,8}-\d{1}$/, {
      message: "Formato de CUIT inválido (ej: 20-8954756-5)"
    })
    .optional()
    .or(z.literal("")),
  
  // Validación de teléfono (solo números y + opcional)
  telefono: z.string()
    .trim()
    .refine((val) => val === "" || /^\+?[0-9]+$/.test(val), {
      message: "Solo números (ej: 112233) o + al inicio",
    })
    .optional(),
  
  email: z.string()
    .email("El formato del email no es válido")
    .optional()
    .or(z.literal("")), // Permite vacío
    
  direccion: z.string().trim().optional(),
  
  // Saldo es opcional al crear, pero numérico si se envía
  saldo: z.coerce.number().optional(),
});

// 2. Definición del Estado para el Formulario
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

    // 👇 SOLUCIÓN DEL ERROR:
    // Convertimos el objeto Decimal a un número simple de JavaScript
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

// --- CREAR CLIENTE ---
export async function crearCliente(prevState: State, formData: FormData) {
  // Extraer datos
  const rawData = {
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    telefono: formData.get("telefono"),
    email: formData.get("email"),
    direccion: formData.get("direccion"),
  };

  // Validar
  const validatedFields = clienteSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan datos o son incorrectos.",
      payload: rawData, // Devolvemos lo escrito para no borrarlo
    };
  }

  try {
    await prisma.cuenta_corriente.create({
      data: {
        nombre: validatedFields.data.nombre,
        cuit: validatedFields.data.cuit || null,
        telefono: validatedFields.data.telefono || null,
        email: validatedFields.data.email || null,
        direccion: validatedFields.data.direccion || null,
        saldo: 0,       // Inicializa en 0
        estado: "Al Día" // Estado inicial
      },
    });
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    return {
      message: "Error de base de datos. Intente nuevamente.",
      payload: rawData,
    };
  }

  revalidatePath("/cuentas-corrientes");
  redirect("/cuentas-corrientes");
}

// --- ACTUALIZAR CLIENTE (Con Validación y Lógica de Saldo) ---
export async function actualizarCliente(id: number, prevState: State, formData: FormData) {
  const rawData = {
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    telefono: formData.get("telefono"),
    email: formData.get("email"),
    direccion: formData.get("direccion"),
    saldo: formData.get("saldo"), // Recibimos el saldo para validarlo
  };

  const validatedFields = clienteSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Revise los errores en el formulario.",
      payload: rawData,
    };
  }

  try {
    // Calculamos el nuevo estado basado en el saldo
    const nuevoSaldo = validatedFields.data.saldo ?? 0;
    const nuevoEstado = nuevoSaldo < 0 ? "Deudor" : "Al Día";

    await prisma.cuenta_corriente.update({
      where: { id },
      data: {
        nombre: validatedFields.data.nombre,
        cuit: validatedFields.data.cuit || null,
        telefono: validatedFields.data.telefono || null,
        email: validatedFields.data.email || null,
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

    // 👇 SOLUCIÓN DEL ERROR TAMBIÉN AQUÍ:
    return {
      ...cuenta,
      saldo: cuenta.saldo.toNumber(),
    };

  } catch (error) {
    console.error("Error al obtener cliente:", error);
    return null;
  }
}


// --- ELIMINAR CLIENTE ---
export async function eliminarCliente(id: number) {
  try {
    await prisma.cuenta_corriente.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    throw new Error("No se pudo eliminar");
  }

  revalidatePath("/cuentas-corrientes");
  redirect("/cuentas-corrientes");
}