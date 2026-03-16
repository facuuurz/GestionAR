import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import NewUserForm from "./NewUserForm";

export const metadata = {
  title: "Nuevo Empleado | GestionAR",
};

export default async function NuevoEmpleadoPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/");
  }

  return <NewUserForm currentUserRole={session.role} />;
}
