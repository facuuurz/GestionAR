import Link from "next/link";
import FormularioPromocion from "@/components/promociones/FormularioPromocion";
import { crearPromocion } from "@/actions/promociones";

export default function NuevaPromocionPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">
            <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
                
                {/* --- BREADCRUMBS --- */}
                <div className="w-full mb-4">
                    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
                        <Link href="/" className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors">
                            Panel
                        </Link>
                        <span className="material-symbols-outlined text-neutral-400 text-base mx-2">chevron_right</span>
                        <Link href="/promociones" className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors">
                            Promociones
                        </Link>
                        <span className="material-symbols-outlined text-neutral-400 text-base mx-2">chevron_right</span>
                        <span className="text-slate-900 dark:text-white font-bold">
                            Agregar Nueva Promoción
                        </span>
                    </nav>
                </div>

                {/* --- TÍTULO --- */}
                <div className="w-full mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Agregar Nueva Promoción</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">Ingrese los detalles de la nueva campaña promocional (Cálculo Automático).</p>
                </div>

                {/* --- FORMULARIO IMPORTADO --- */}
                <FormularioPromocion actionFunc={crearPromocion} />

            </main>
        </div>
    );
}