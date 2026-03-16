import { getSession } from "@/lib/session";
import InventarioClient from "@/app/inventario/InventarioClient";

export default async function InventarioPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN" || session?.role === "SUPERADMIN";

  return <InventarioClient isAdmin={isAdmin} />;
}