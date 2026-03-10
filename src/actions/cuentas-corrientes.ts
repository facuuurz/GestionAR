"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// --- 1. ESQUEMA DE VALIDACIÓN ---
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
  ciudad: z.string().trim().optional().or(z.literal("")),
  saldo: z.coerce.number().optional(),
});

// --- 2. DEFINICIÓN DEL ESTADO ---
export type State = {
  errors?: {
    nombre?: string[];
    cuit?: string[];
    telefono?: string[];
    email?: string[];
    direccion?: string[];
    ciudad?: string[];
    saldo?: string[];
  };
  message?: string | null;
  payload?: any;
};

// --- 3. OBTENER TODOS LOS CLIENTES (PAGINADOS Y FILTRADOS) ---
const ITEMS_POR_PAGINA = 15;

export async function obtenerClientes(filtros?: {
  query?: string;
  estado?: string;
  minSaldo?: string;
  maxSaldo?: string;
  sort?: string;
  page?: number;
}) {
  try {
    const where: any = {};

    // A. Búsqueda (Nombre o CUIT o ID)
    if (filtros?.query) {
      where.OR = [
        { nombre: { contains: filtros.query, mode: "insensitive" } },
        { cuit: { contains: filtros.query, mode: "insensitive" } },
      ];
      // Si es un número válido, buscar también por ID
      if (!isNaN(Number(filtros.query))) {
        where.OR.push({ id: Number(filtros.query) });
      }
    }

    // B. Estado
    if (filtros?.estado && filtros.estado !== "Todos") {
      where.estado = filtros.estado;
    }

    // C. Rango de Saldo
    if (filtros?.minSaldo || filtros?.maxSaldo) {
      where.saldo = {};
      if (filtros.minSaldo) where.saldo.gte = parseFloat(filtros.minSaldo);
      if (filtros.maxSaldo) where.saldo.lte = parseFloat(filtros.maxSaldo);
    }

    // D. Ordenamiento
    let orderBy: any = { id: "desc" };
    switch (filtros?.sort) {
      case "nombre-asc": orderBy = { nombre: 'asc' }; break;
      case "nombre-desc": orderBy = { nombre: 'desc' }; break;
      case "saldo-mayor": orderBy = { saldo: 'desc' }; break;
      case "saldo-menor": orderBy = { saldo: 'asc' }; break;
      case "antiguos": orderBy = { createdAt: 'asc' }; break;
    }

    // E. Paginación
    const page = filtros?.page || 1;
    const skip = (page - 1) * ITEMS_POR_PAGINA;

    // Ejecutar consultas
    const totalClientes = await prisma.cuenta_corriente.count({ where });
    
    const clientesRaw = await prisma.cuenta_corriente.findMany({
      where,
      orderBy,
      skip,
      take: ITEMS_POR_PAGINA,
    });

    const clientes = clientesRaw.map((cliente) => ({
      ...cliente,
      saldo: cliente.saldo.toNumber(), 
    }));

    return {
      clientes,
      totalPages: Math.ceil(totalClientes / ITEMS_POR_PAGINA) || 1,
      totalClientes,
      error: null
    };

  } catch (error) {
    console.error("Error al obtener cuentas:", error);
    return { clientes: [], totalPages: 1, totalClientes: 0, error: "Error conectando a la base de datos." };
  }
}

// --- 4. CREAR CLIENTE ---
export async function crearCliente(prevState: State, formData: FormData) {
  const rawData = {
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    telefono: formData.get("telefono"),
    email: formData.get("email"),
    direccion: formData.get("direccion"),
    ciudad: formData.get("ciudad"),
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
    const cuitExistente = await prisma.cuenta_corriente.findFirst({
        where: { cuit: validatedFields.data.cuit }
    });

    if (cuitExistente) {
        return {
            errors: { cuit: ["Este CUIT/CUIL ya está registrado en el sistema."] },
            message: "El CUIT ya existe.",
            payload: rawData,
        };
    }

    const saldoInicial = validatedFields.data.saldo ?? 0;
    const estadoInicial = saldoInicial < 0 ? "Deudor" : "Al Día";

    await prisma.cuenta_corriente.create({
      data: {
        nombre: validatedFields.data.nombre,
        cuit: validatedFields.data.cuit,
        telefono: validatedFields.data.telefono,
        email: validatedFields.data.email,
        direccion: validatedFields.data.direccion || null,
        ciudad: validatedFields.data.ciudad || null,
        saldo: saldoInicial,
        estado: estadoInicial
      },
    });

  } catch (error) {
    console.error("Error al crear cuenta:", error);
    return {
      message: "Error de base de datos.",
      payload: rawData,
    };
  }

  revalidatePath("/cuentas-corrientes");
  redirect("/cuentas-corrientes");
}

// --- 5. ACTUALIZAR CLIENTE ---
export async function actualizarCliente(id: number, prevState: State, formData: FormData) {
  const saldoRaw = formData.get("saldo")?.toString();

  const rawData = {
    nombre: formData.get("nombre"),
    cuit: formData.get("cuit"),
    telefono: formData.get("telefono"),
    email: formData.get("email"),
    direccion: formData.get("direccion"),
    ciudad: formData.get("ciudad"),
    saldo: saldoRaw === "" ? undefined : saldoRaw, 
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
    const cuitExistente = await prisma.cuenta_corriente.findFirst({
        where: { 
            cuit: validatedFields.data.cuit,
            NOT: { id: id } 
        }
    });

    if (cuitExistente) {
        return {
            errors: { cuit: ["Este CUIT/CUIL ya pertenece a otro cliente."] },
            message: "El CUIT ya existe.",
            payload: rawData,
        };
    }

    const cuentaActual = await prisma.cuenta_corriente.findUnique({
        where: { id }
    });

    if (!cuentaActual) {
        return { message: "El cliente no existe." };
    }

    const nuevoSaldo = validatedFields.data.saldo ?? cuentaActual.saldo.toNumber();
    const nuevoEstado = nuevoSaldo < 0 ? "Deudor" : "Al Día";

    await prisma.cuenta_corriente.update({
      where: { id },
      data: {
        nombre: validatedFields.data.nombre,
        cuit: validatedFields.data.cuit,
        telefono: validatedFields.data.telefono,
        email: validatedFields.data.email,
        direccion: validatedFields.data.direccion || null,
        ciudad: validatedFields.data.ciudad || null,
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

// --- 6. OBTENER CLIENTE INDIVIDUAL ---
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

// --- 7. ELIMINAR CLIENTE ---
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

// --- 8. ACTUALIZAR SALDO Y REGISTRAR MOVIMIENTO ---
export async function actualizarSaldoCliente(id: number, monto: number) {
  try {
    const esCredito = monto > 0;
    const tipo = esCredito ? "CREDITO" : "DEBITO";
    const descripcion = esCredito ? "Pago recibido / Ajuste a favor" : "Ajuste de deuda / Cargo";

    await prisma.$transaction(async (tx) => {
      await tx.cuenta_corriente.update({
        where: { id },
        data: {
          saldo: { increment: monto },
        },
      });

      await tx.movimiento.create({
        data: {
          cuentaCorrienteId: id,
          monto: Math.abs(monto), 
          tipo: tipo,
          descripcion: descripcion,
        }
      });

      const cuenta = await tx.cuenta_corriente.findUnique({ where: { id } });
      if (cuenta) {
        const nuevoEstado = cuenta.saldo.toNumber() < 0 ? "Deudor" : "Al Día";
        if (cuenta.estado !== nuevoEstado) {
          await tx.cuenta_corriente.update({
            where: { id },
            data: { estado: nuevoEstado }
          });
        }
      }
    });

    revalidatePath("/cuentas-corrientes");
    revalidatePath(`/cuentas-corrientes/${id}`); 
    return { success: true, message: "Saldo actualizado y movimiento registrado." };
  } catch (error) {
    console.error("Error al actualizar saldo:", error);
    return { success: false, message: "Error al actualizar el saldo" };
  }
}

// --- 9. OBTENER HISTORIAL DE MOVIMIENTOS ---
export async function obtenerMovimientosCliente(id: number) {
  try {
    const movimientos = await prisma.movimiento.findMany({
      where: { cuentaCorrienteId: id },
      orderBy: { fecha: 'desc' },
    });

    return movimientos.map(m => ({
      ...m,
      monto: m.monto.toNumber(),
    }));
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [];
  }
}