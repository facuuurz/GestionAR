export default function ProductRow({ prod }) {
  return (
    <tr className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
      
      {/* CÓDIGO */}
      <td className="px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 font-mono">
        {prod.id}
      </td>

      {/* PRODUCTO */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-primary dark:text-white hover:text-blue-600 cursor-pointer hover:underline hover:underline-offset-2 hover:decoration-2">
            {prod.nombre}
          </span>
          {prod.sub && <span className="text-xs text-neutral-500">{prod.sub}</span>}
        </div>
      </td>

      {/* STOCK (Con lógica de colores) */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
          ${prod.status === 'ok' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
            prod.status === 'low' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
          {prod.status === 'low' && <span className="material-symbols-outlined text-[14px] mr-1">warning</span>}
          {prod.stock}
        </span>
      </td>

      {/* PRECIO */}
      <td className="px-4 py-3 text-sm font-medium text-primary dark:text-white">
        {prod.precio}
      </td>

      {/* TIPO */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-[#444] text-gray-800 dark:text-neutral-300">
          {prod.tipo}
        </span>
      </td>

      {/* PROVEEDOR */}
      <td className="px-4 py-3 text-sm text-neutral-500 font-mono">
        {prod.prov}
      </td>
      
      {/* ACCIONES (Sticky Right) */}
      <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-[#222] group-hover:bg-neutral-50 dark:group-hover:bg-[#333] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
        <button className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black">
          <span className="material-symbols-outlined text-[16px] transition-transform duration-500 ease-in-out">
            sync_alt
          </span>
          <span>Actualizar</span>
        </button>
      </td>
    </tr>
  );
}