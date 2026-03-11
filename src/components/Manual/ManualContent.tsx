"use client";

import { ManualSection } from "@/actions/manualActions";

interface ManualContentProps {
  content: ManualSection | null;
  loading: boolean;
  error: string | null;
}

export default function ManualContent({ content, loading, error }: ManualContentProps) {
  if (loading) {
    return (
      <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-8 flex flex-col gap-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full mt-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
        <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
        <h3 className="text-xl font-bold text-red-800 dark:text-red-400">Hubo un problema</h3>
        <p className="text-red-600 dark:text-red-300 max-w-md">{error}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex-1 bg-gray-50 dark:bg-[#1e293b] rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-8 flex flex-col items-center justify-center gap-4 text-center h-[500px]">
        <span className="material-symbols-outlined text-gray-400 text-6xl">travel_explore</span>
        <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-300">Selecciona un tema</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Elige una sección del panel lateral para ver la información detallada de cómo usar ese módulo.
        </p>
      </div>
    );
  }

  // Pequeño formateador básico para el contenido estático (Markdown simple)
  // Reemplaza asteriscos por negritas, y los saltos de línea por espaciados.
  const formatContent = (text: string) => {
    // Esto es temporal: en el futuro podés usar una librería como react-markdown
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Headers
      if (line.trim().startsWith("### ")) {
        return <h3 key={index} className="text-xl font-bold text-gray-800 dark:text-white mt-6 mb-3 border-b border-gray-100 dark:border-gray-800 pb-2">{line.replace("### ", "")}</h3>;
      }
      
      // List entries
      if (line.trim().startsWith("- ")) {
        return (
          <li key={index} className="ml-6 list-disc mb-2 text-gray-600 dark:text-gray-300">
             <span dangerouslySetInnerHTML={{ __html: line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </li>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        return (
          <li key={index} className="ml-6 list-decimal mb-2 text-gray-600 dark:text-gray-300">
             <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </li>
        );
      }
      
      // Tips / Italic
      if (line.trim().startsWith("*") && line.trim().endsWith("*") && line.trim().length > 2) {
        return (
          <div key={index} className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 p-3 my-4 rounded-r-md">
             <p className="text-sm italic text-amber-800 dark:text-amber-200">
               {line.replace(/\*/g, '')}
             </p>
          </div>
        );
      }
      
      // Parrafos regulares
      if (line.trim() !== "") {
         return (
           <p key={index} className="mb-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
           </p>
         );
      }
      
      return null;
    });
  };

  return (
    <article className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl shadow-md border border-gray-100 dark:border-gray-800 p-6 md:p-8 flex flex-col overflow-y-auto">
      <header className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
           <span className="material-symbols-outlined text-3xl">{content.icon}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{content.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{content.description}</p>
        </div>
      </header>

      <div className="prose prose-blue dark:prose-invert max-w-none">
        {formatContent(content.content)}
      </div>

      <footer className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-400">
        <span>Última actualización: Hoy</span>
        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
          <span className="material-symbols-outlined text-sm">thumb_up</span>
          ¿Te fue útil este artículo?
        </button>
      </footer>
    </article>
  );
}
