import { useState, useCallback, useEffect } from "react";
import { getManualSections, getManualContentById, searchManual, ManualSection } from "@/actions/manualActions";

interface OmitManualSectionContent extends Omit<ManualSection, 'content'> {}

export function useManual() {
  const [sections, setSections] = useState<OmitManualSectionContent[]>([]);
  const [activeContent, setActiveContent] = useState<ManualSection | null>(null);
  const [searchResults, setSearchResults] = useState<ManualSection[] | null>(null);
  
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial de todas las secciones
  const loadSections = useCallback(async () => {
    try {
      setLoadingSections(true);
      setError(null);
      const data = await getManualSections();
      setSections(data);
    } catch (err: any) {
      console.error("Error al cargar secciones del manual:", err);
      setError("No se pudieron cargar los temas del manual. Revisa tu conexión.");
    } finally {
      setLoadingSections(false);
    }
  }, []);

  // Carga del contenido específico por ID
  const loadContent = useCallback(async (id: string | null) => {
    if (!id) {
      setActiveContent(null);
      return;
    }
    
    try {
      setLoadingContent(true);
      setError(null);
      const contentData = await getManualContentById(id);
      setActiveContent(contentData);
    } catch (err: any) {
      console.error(`Error al cargar la sección ${id}:`, err);
      setError("No se pudo cargar el contenido. Revisa tu conexión.");
    } finally {
      setLoadingContent(false);
    }
  }, []);

  // Búsqueda en el manual
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setLoadingSearch(true);
      setError(null);
      const results = await searchManual(query);
      setSearchResults(results);
    } catch (err: any) {
      console.error("Error en la búsqueda rápida:", err);
      setError("Ocurrió un error al buscar en el manual.");
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  useEffect(() => {
    loadSections();
  }, [loadSections]);

  return {
    sections,
    activeContent,
    searchResults,
    // Estados de carga agrupados
    loading: {
      sections: loadingSections,
      content: loadingContent,
      search: loadingSearch,
    },
    error,
    loadContent,
    performSearch,
    reload: loadSections // alias al estilo inventario
  };
}
