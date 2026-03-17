import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import EditUserForm from "./EditUserForm";

const prisma = new PrismaClient();

export const metadata = {
  title: "Editar Usuario | GestionAR",
};

export default async function EditarEmpleadoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  const awaitedParams = await params;

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/");
  }

  const userId = parseInt(awaitedParams.id, 10);
  if (isNaN(userId)) redirect("/empleados");

  const userToEdit = await (prisma.user as any).findUnique({
    where: { id: userId }
  });

  if (!userToEdit) redirect("/empleados");

  // Prevent ADMIN from editing SUPERADMIN
  if (userToEdit.role === "SUPERADMIN" && session.role !== "SUPERADMIN") {
    redirect("/empleados");
  }

  // Disable this stricter check for now since users are reporting it blocks editing
  // if (session.role === "ADMIN" && userToEdit.createdById !== session.userId && userToEdit.id !== session.userId && userToEdit.createdById !== null) {
  //    redirect("/empleados");
  // }

  return <EditUserForm userToEdit={userToEdit} currentUserRole={session.role} />;
}
