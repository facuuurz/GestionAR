"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Componentes
import ManualSidebar from "@/components/Manual/ManualSidebar";
import ManualContent from "@/components/Manual/ManualContent";
import ManualSearch from "@/components/Manual/ManualSearch";

// Hooks
import { useManual } from "@/hooks/useManual";

function ManualPageContent() {
  const searchParams = useSearchParams();
  const currentSectionId = searchParams.get("seccion");

  const {
    sections,
    activeContent,
    loading,
    error,
    loadContent,
    reload
  } = useManual();

  // Escuchar cambios en la URL para cargar el contenido
  useEffect(() => {
    // Si hay un ID en la URL, lo cargamos. Si no, cargamos "ventas" por defecto
    const idToLoad = currentSectionId || "ventas";
    loadContent(idToLoad);
  }, [currentSectionId, loadContent]);

  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-360 mx-auto overflow-hidden relative min-h-[calc(100vh-80px)] bg-[#f6f6f8] dark:bg-[#101622]">

      {/* Encabezado Principal y Buscador */}
      <div className="w-full flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-500 text-3xl">book</span>
            Centro de Ayuda
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg">
            Aprende a utilizar todas las herramientas de GestionAR. Selecciona un módulo o realiza una búsqueda de tu duda.
          </p>
        </div>

        {/* Buscador de ayuda */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex justify-end z-20">
          <ManualSearch />
        </div>
      </div>

      {/* Cartel de error global (ej: falla de internet inicial) */}
      {error && !loading.sections && sections.length === 0 && (
        <div className="w-full mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-2xl">cloud_off</span>
            <div className="flex flex-col">
              <p className="text-red-800 dark:text-red-300 font-semibold text-sm">Problema de conexión</p>
              <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
            </div>
          </div>
          <button
            onClick={() => reload()}
            className="shrink-0 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800/50 dark:hover:bg-red-800 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Layout de Contenido: Sidebar + Vista de Contenido */}
      <div className="w-full flex flex-col md:flex-row gap-6 flex-1 h-full min-h-[500px]">
        {/* Sidebar de navegación */}
        <ManualSidebar sections={sections} loading={loading.sections} />

        {/* Panel principal de lectura */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <ManualContent
            content={activeContent}
            loading={loading.content}
            error={activeContent === null && !loading.content ? error : null}
          />
        </div>
      </div>
    </main>
  );
}

export default function ManualPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-[#f6f6f8] dark:bg-[#101622]">
        <span className="material-symbols-outlined animate-spin text-blue-500 text-4xl">progress_activity</span>
      </div>
    }>
      <ManualPageContent />
    </Suspense>
  );
}
