"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
export async function crearCliente(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const cuit = formData.get("cuit") as string;
  const telefono = formData.get("telefono") as string;
  const email = formData.get("email") as string;
  const direccion = formData.get("direccion") as string;
  
  if (!nombre) throw new Error("El nombre es obligatorio");

  try {
    await prisma.cuenta_corriente.create({
      data: {
        nombre,
        cuit: cuit || null,
        telefono,
        email,
        direccion,
        // El saldo por defecto es 0, Prisma lo maneja bien
      },
    });
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    throw new Error("No se pudo crear la cuenta");
  }

  revalidatePath("/cuentas-corrientes");
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

// --- ACTUALIZAR CLIENTE ---
export async function actualizarCliente(id: number, formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const cuit = formData.get("cuit") as string;
  const telefono = formData.get("telefono") as string;
  const email = formData.get("email") as string;
  const direccion = formData.get("direccion") as string;
  const saldoInput = formData.get("saldo") as string;

  if (!nombre) throw new Error("El nombre es obligatorio");

  try {
    const nuevoSaldo = saldoInput ? parseFloat(saldoInput) : 0;
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
        estado: nuevoEstado,
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