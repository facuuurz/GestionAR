import { obtenerPromocionPorId } from "@/actions/promociones";
import FormularioEditar from "./FormularioEditar";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditarPromocionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id);
  const promocion = await obtenerPromocionPorId(id);

  if (!promocion) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] text-slate-800 dark:text-slate-200">
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-7xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex mb-4 text-sm text-slate-500 dark:text-slate-400">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link className="hover:text-slate-700 dark:hover:text-slate-200" href="/">Panel</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
                  <Link className="hover:text-slate-700 dark:hover:text-slate-200" href="/promociones">Promociones</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">Editar Promoción</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Editar Promoción</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">Modifique los detalles de la promoción vigente para actualizar el inventario.</p>
          </div>

          <FormularioEditar promocion={promocion} />
        </div>
      </main>
    </div>
  );
}