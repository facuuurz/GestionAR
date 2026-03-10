interface Props {
  cliente: {
    nombre: string;
    cuit: string | null;
    email: string | null;
    telefono: string | null;
    direccion: string | null;
    ciudad: string | null;
    saldo: number;
  };
}

export default function InfoCuentaCliente({ cliente }: Props) {
  // Helper de formato local
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const saldo = Number(cliente.saldo);
  const esDeudor = saldo < 0;
  
  // Clases compartidas
  const infoCardClass = "bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg flex items-start gap-4 transition-all duration-300 hover:shadow-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:-translate-y-1";

  return (
    <div className="bg-white dark:bg-[#1a2632] rounded-xl border border-[#dbdfe6] dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* COLUMNA IZQUIERDA: DATOS PERSONALES */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            
            <div className={infoCardClass}>
              <div className="size-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="text-[#616f89] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Nombre / Razón Social</p>
                <p className="text-[#111318] dark:text-white font-bold text-lg">{cliente.nombre}</p>
              </div>
            </div>

            <div className={infoCardClass}>
              <div className="size-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">badge</span>
              </div>
              <div>
                <p className="text-[#616f89] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">CUIT/CUIL</p>
                <p className="text-[#111318] dark:text-white font-bold text-lg">{cliente.cuit || "-"}</p>
              </div>
            </div>

            <div className={infoCardClass}>
              <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <div>
                <p className="text-[#616f89] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Email</p>
                {cliente.email ? (
                    <a className="text-primary hover:underline font-medium text-base break-all text-blue-600 dark:text-blue-400" href={`mailto:${cliente.email}`}>
                        {cliente.email}
                    </a>
                ) : (
                    <p className="text-[#111318] dark:text-white font-medium text-lg">-</p>
                )}
              </div>
            </div>

            <div className={infoCardClass}>
              <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                <p className="text-[#616f89] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Teléfono</p>
                <p className="text-[#111318] dark:text-white font-medium text-lg">{cliente.telefono || "-"}</p>
              </div>
            </div>

            <div className={infoCardClass}>
              <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="text-[#616f89] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Dirección</p>
                <p className="text-[#111318] dark:text-white font-medium text-lg">{cliente.direccion || "-"}</p>
              </div>
            </div>

            <div className={infoCardClass}>
              <div className="size-10 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">map</span>
              </div>
              <div>
                <p className="text-[#616f89] dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Ciudad</p>
                <p className="text-[#111318] dark:text-white font-medium text-lg">{cliente.ciudad || "-"}</p>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: SALDO */}
          <div className="shrink-0 lg:w-1/3 flex flex-col">
            <div className={`relative h-full overflow-hidden rounded-xl border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg
                ${esDeudor 
                  ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                  : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'}`
            }>
              <div className={`absolute -bottom-6 -right-6 pointer-events-none select-none opacity-[0.07] dark:opacity-[0.05]
                  ${esDeudor ? 'text-red-900 dark:text-red-500' : 'text-emerald-900 dark:text-emerald-500'}`}
              >
                  <span className="material-symbols-outlined text-[180px]">
                      {esDeudor ? 'money_off' : 'savings'}
                  </span>
              </div>

              <div className={`relative z-10 flex items-center gap-2 mb-4 
                  ${esDeudor ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}
              >
                <div className={`p-2 rounded-lg flex items-center justify-center ${esDeudor ? 'bg-red-100 dark:bg-red-900/40' : 'bg-emerald-100 dark:bg-emerald-900/40'}`}>
                    <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                </div>
                <p className="text-sm font-bold uppercase tracking-wider">Saldo Actual</p>
              </div>
              
              <div className="relative z-10">
                  <p className={`text-4xl md:text-5xl font-extrabold tracking-tight
                      ${esDeudor ? 'text-red-900 dark:text-white' : 'text-emerald-900 dark:text-white'}`}
                  >
                    {formatMoney(saldo)}
                  </p>
              </div>
              
              <div className={`relative z-10 mt-6 flex items-center gap-2 text-sm font-semibold
                  ${esDeudor ? 'text-red-600 dark:text-red-300' : 'text-emerald-600 dark:text-emerald-300'}`}
              >
                {esDeudor ? (
                    <>
                        <span className="material-symbols-outlined text-[20px]">error</span>
                        <span>Deuda pendiente</span>
                    </>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>Saldo a favor disponible</span>
                    </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}