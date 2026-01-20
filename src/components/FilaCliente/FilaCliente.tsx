import Link from "next/link";

interface ClienteRowProps {
  cliente: any; 
}

export default function FilaCliente({ cliente }: ClienteRowProps) {
  // Helper para formato de moneda
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  // Helper para estilos
  let badgeClass = "";
  let iconName = "";

  switch (cliente.estado) {
    case "Al Día":
        badgeClass = "bg-[#dcfce7] text-[#166534] dark:bg-green-900/30 dark:text-green-300";
        iconName = "check_circle";
        break;
    case "Deudor":
        badgeClass = "bg-[#fee2e2] text-[#991b1b] dark:bg-red-900/30 dark:text-red-300";
        iconName = "error";
        break;
    case "Pendiente":
        badgeClass = "bg-[#fef9c3] text-[#854d0e] dark:bg-yellow-900/30 dark:text-yellow-300";
        iconName = "warning";
        break;
    default:
        badgeClass = "bg-gray-100 text-gray-800";
        iconName = "help";
  }

  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
      
      {/* ID CLIENTE */}
      <td className="px-4 py-3 text-sm font-bold dark:text-neutral-400 font-mono hover:underline hover:text-blue-600 cursor-pointer text-[#135bec]">
        <Link href={`/cuentas-corrientes/${cliente.id}`}>
          CC-{cliente.id.toString().padStart(5, '0')}
        </Link>
      </td>

      {/* CLIENTE / RAZÓN SOCIAL */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <Link 
            href={`/cuentas-corrientes/${cliente.id}`}
            className="text-left text-sm font-bold text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:underline hover:underline-offset-2 transition-colors"
          >
            {cliente.nombre}
          </Link>
          <span className="text-xs text-neutral-500 mt-0.5">
              CUIT: {cliente.cuit || "-"}
          </span>
        </div>
      </td>

      {/* ESTADO */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${badgeClass}`}>
          <span className="material-symbols-outlined text-[16px] mr-1.5">{iconName}</span>
          {cliente.estado}
        </span>
      </td>

      {/* SALDO ACTUAL */}
      <td className={`px-4 py-3 text-sm font-medium ${Number(cliente.saldo) < 0 ? 'text-[#991b1b] dark:text-red-400' : 'text-[#166534] dark:text-green-400'}`}>
        {formatMoney(Number(cliente.saldo))}
      </td>

      {/* ACCIONES */}
      <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-[#222] group-hover:bg-neutral-50 dark:group-hover:bg-[#333] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
        <Link 
          href={`/cuentas-corrientes/editar/${cliente.id}`}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black"
        >
          <span className="material-symbols-outlined text-[16px] transition-transform duration-500 ease-in-out">
            edit 
          </span>
          <span>Actualizar</span>
        </Link>
      </td>
    </tr>
  );
}