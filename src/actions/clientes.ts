"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// OBTENER
export async function obtenerClientes(query: string = "") {
  try {
    // 👇 CAMBIO AQUÍ: prisma.cuenta_corriente
    const cuentas = await prisma.cuenta_corriente.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { cuit: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { id: 'desc' },
    });
    return cuentas;
  } catch (error) {
    console.error("Error al obtener cuentas:", error);
    return [];
  }
}

// CREAR
export async function crearCliente(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const cuit = formData.get("cuit") as string;
  const telefono = formData.get("telefono") as string;
  const email = formData.get("email") as string;
  const direccion = formData.get("direccion") as string;
  
  if (!nombre) throw new Error("El nombre es obligatorio");

  try {
    // 👇 CAMBIO AQUÍ
    await prisma.cuenta_corriente.create({
      data: {
        nombre,
        cuit: cuit || null,
        telefono,
        email,
        direccion,
      },
    });
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    throw new Error("No se pudo crear la cuenta");
  }

  revalidatePath("/cuentas-corrientes");
  redirect("/cuentas-corrientes");
}

export async function obtenerClientePorId(id: number) {
  try {
    const cuenta = await prisma.cuenta_corriente.findUnique({
      where: { id },
    });
    return cuenta;
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    return null;
  }
}

export async function actualizarCliente(id: number, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const cuit = formData.get("cuit") as string;
  const telefono = formData.get("telefono") as string;
  const email = formData.get("email") as string;
  const direccion = formData.get("direccion") as string;
  const saldoInput = formData.get("saldo") as string;

  if (!nombre) throw new Error("El nombre es obligatorio");

  try {
    // 1. Convertimos el saldo a número
    const nuevoSaldo = saldoInput ? parseFloat(saldoInput) : 0;

    // 2. Lógica Automática:
    // Si el saldo es menor a 0 (negativo) -> "Deudor"
    // Si es 0 o positivo -> "Al Día"
    const nuevoEstado = nuevoSaldo < 0 ? "Deudor" : "Al Día";

    await prisma.cuenta_corriente.update({
      where: { id },
      data: {
        nombre,
        cuit: cuit || null,
        telefono,
        email,
        direccion,
        saldo: nuevoSaldo,
        estado: nuevoEstado, // 👈 Aquí guardamos el estado calculado
      },
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    throw new Error("No se pudo actualizar");
  }

  revalidatePath("/cuentas-corrientes");
  revalidatePath(`/cuentas-corrientes/${id}`);
  redirect("/cuentas-corrientes");
}

export async function eliminarCliente(id: number) {
  try {
    await prisma.cuenta_corriente.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    throw new Error("No se pudo eliminar");
  }

  // Revalidar y redirigir
  revalidatePath("/cuentas-corrientes");
  redirect("/cuentas-corrientes");
}