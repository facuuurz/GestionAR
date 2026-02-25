import { obtenerHistorialVentas } from "@/actions/ventas";
import HistorialVentas from "@/components/Historial/HistorialVentas";

export default async function HistorialPage() {
  // 1. Obtenemos los datos reales desde la BD
  const ventas = await obtenerHistorialVentas();

  // 2. Se los pasamos al componente cliente
  return (
    <HistorialVentas ventasIniciales={ventas} />
  );
}