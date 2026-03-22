"use client";

import { useState, useActionState, useEffect, useTransition, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { crearProducto } from "@/actions/productos";
import { obtenerCategorias } from "@/actions/categorias";
import AgregarTipoModal from "@/components/Inventario/AgregarTipoModal/AgregarTipoModal";
import InputConIcono from "@/components/Inventario/ui/InputConIcono";
import TextareaConContador from "@/components/Inventario/ui/TextareaConContador";
import ToggleSwitch from "@/components/Inventario/ui/ToggleSwitch";
import { toast } from "react-hot-toast";
import { obtenerProveedoresActivos } from "@/actions/proveedores";

type Categoria = {
  id: number;
  nombre: string;
};

const CATEGORIAS_BASICAS = ["bebidas", "alimentos", "limpieza", "otros"];



export default function FormularioNuevoProducto() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // --- 1. ESTADOS PARA LOS INPUTS (Para que persistan) ---
  const [nombre, setNombre] = useState("");
  const [codigoBarra, setCodigoBarra] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [stock, setStock] = useState("");
  const [precio, setPrecio] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [esPorPeso, setEsPorPeso] = useState(false);

  // States for Proveedor combobox
  const [proveedores, setProveedores] = useState<{codigo: string, razonSocial: string}[]>([]);
  const [searchProveedor, setSearchProveedor] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [isProvDropdownOpen, setIsProvDropdownOpen] = useState(false);
  const provDropdownRef = useRef<HTMLDivElement>(null);

  const [descLength, setDescLength] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isPendingCat, startTransitionCat] = useTransition();

  // Server Action
  const initialState = { message: null, errors: {} };
  const [state, dispatch, isPending] = useActionState(crearProducto, initialState);

  // Cargar categorías
  const cargarCategorias = () => {
    startTransitionCat(async () => {
      const datos = await obtenerCategorias();
      setCategorias(datos);
    });
  };

  useEffect(() => {
    cargarCategorias();
    obtenerProveedoresActivos().then(setProveedores);
  }, []);

  // Click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (provDropdownRef.current && !provDropdownRef.current.contains(event.target as Node)) {
        setIsProvDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 2. EFECTO PARA RECUPERAR DATOS SI HAY ERROR ---
  useEffect(() => {
    if (state.payload) {
      setNombre(state.payload.nombre || "");
      setCodigoBarra(state.payload.codigoBarra || "");
      
      const provVal = state.payload.proveedor || "";
      setSearchProveedor(provVal);
      setSelectedProveedor(provVal);

      setStock(state.payload.stock?.toString() || "");
      setPrecio(state.payload.precio?.toString() || "");
      setFechaVencimiento(state.payload.fechaVencimiento || "");
      setDescripcion(state.payload.descripcion || "");

      if (state.payload.tipo) {
        setSelectedTipo(state.payload.tipo);
        setSearchTerm(state.payload.tipo);
      }

      if (state.payload.esPorPeso !== undefined) {
        setEsPorPeso(String(state.payload.esPorPeso) === "true");
      }

      if (state.payload.descripcion) {
        setDescLength(state.payload.descripcion.length);
      }
    }
    
    if ((state as any).success) {
      toast.success((state as any).message || "El producto se creó correctamente.", {
        style: { background: "#10B981", color: "#fff", padding: "16px" }, // Green
        iconTheme: { primary: "#fff", secondary: "#10B981" }
      });
      setTimeout(() => {
        router.push("/inventario");
      }, 1000);
    }
  }, [state, router]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    setDescripcion(target.value);
    setDescLength(target.value.length);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleCloseModal = (nuevoNombre?: string) => {
    setIsModalOpen(false);
    if (nuevoNombre) {
      const nuevaCategoriaTemp = { id: Date.now(), nombre: nuevoNombre };
      setCategorias((prev) => [...prev, nuevaCategoriaTemp]);
      setSelectedTipo(nuevoNombre);
      setSearchTerm(nuevoNombre);
      setIsDropdownOpen(false);
      cargarCategorias();
    }
  };

  const handleSelectOption = (valor: string) => {
    setSelectedTipo(valor);
    setSearchTerm(valor);
    setIsDropdownOpen(false);
  };

  const basicasFiltradas = useMemo(() => CATEGORIAS_BASICAS.filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm]);
  
  const misCategoriasFiltradas = useMemo(() => categorias.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  ), [categorias, searchTerm]);

  const proveedoresFiltrados = useMemo(() => proveedores.filter(p => 
    p.codigo.toLowerCase().includes(searchProveedor.toLowerCase()) || 
    p.razonSocial.toLowerCase().includes(searchProveedor.toLowerCase())
  ), [proveedores, searchProveedor]);

  return (
    <>
      {isDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
      )}

      <form action={dispatch} className="bg-white dark:bg-[#1e2736] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden relative z-20">
        <input type="hidden" name="esPorPeso" value={esPorPeso ? "true" : "false"} />

        <div className="border-b border-[#e5e7eb] dark:border-[#2d3748] px-6 py-4 bg-gray-50/50 dark:bg-[#1e2736]">
          <h3 className="text-base font-bold text-[#0d121b] dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">inventory_2</span>
            Información General
          </h3>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InputConIcono
              name="nombre"
              label="Nombre del producto *"
              icon="shopping_bag"
              placeholder="Ej. Coca Cola 2L"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              error={state.errors?.nombre?.[0]}
            />

            <InputConIcono
              name="codigoBarra"
              label="Código de barra *"
              icon="barcode_scanner"
              iconBgColor="bg-purple-100 text-purple-700"
              placeholder="Escanee o ingrese código"
              type="text"
              value={codigoBarra}
              onChange={(e) => setCodigoBarra(e.target.value)}
              error={state.errors?.codigoBarra?.[0]}
              rightElement={
                <button type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                </button>
              }
            />

            <div className="flex flex-col gap-2 relative z-30">
              <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Tipo de Producto *</span>
              <div className="flex gap-2 relative">
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 pointer-events-none z-10">
                    <span className="material-symbols-outlined text-lg">category</span>
                  </div>
                  <input type="hidden" name="tipo" value={selectedTipo} />
                  <input
                    type="text"
                    placeholder="Buscar o seleccionar..."
                    className={`flex w-full rounded-lg border ${state.errors?.tipo ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setIsDropdownOpen(true); if (e.target.value === "") setSelectedTipo(""); }}
                    onFocus={() => setIsDropdownOpen(true)}
                    autoComplete="off"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-black dark:text-gray-400">
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#2d3748] border border-[#e5e7eb] dark:border-[#4a5568] rounded-lg shadow-lg max-h-60 overflow-y-auto z-40">
                      {basicasFiltradas.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-[#1a202c]">Básicos</div>
                          {basicasFiltradas.map((opcion) => (
                            <button key={opcion} type="button" onClick={() => handleSelectOption(opcion)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4a5568] capitalize">{opcion}</button>
                          ))}
                        </div>
                      )}
                      {misCategoriasFiltradas.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-[#1a202c] border-t">Mis Categorías</div>
                          {misCategoriasFiltradas.map((cat) => (
                            <button key={cat.id} type="button" onClick={() => handleSelectOption(cat.nombre)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4a5568] capitalize">{cat.nombre}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center shrink-0 h-12 px-4 rounded-lg border border-[#cfd7e7] bg-[#f8f9fc] hover:bg-gray-100 font-bold text-sm transition-all shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[20px] mr-2">add</span>Agregar
                </button>
              </div>
              {state.errors?.tipo && (
                  <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {state.errors.tipo[0]}
                  </p>
              )}
            </div>

            <div className="flex flex-col gap-2 relative z-20" ref={provDropdownRef}>
              <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Código de Proveedor *</span>
              <div className="flex gap-2 relative">
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 pointer-events-none z-10">
                    <span className="material-symbols-outlined text-lg">local_shipping</span>
                  </div>
                  <input type="hidden" name="proveedor" value={selectedProveedor || searchProveedor} />
                  <input
                    type="text"
                    placeholder="Buscar o ingresar REF-000..."
                    className={`flex w-full rounded-lg border ${state.errors?.proveedor ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                    value={searchProveedor}
                    onChange={(e) => { 
                      setSearchProveedor(e.target.value); 
                      setSelectedProveedor(e.target.value); 
                      setIsProvDropdownOpen(true); 
                    }}
                    onFocus={() => setIsProvDropdownOpen(true)}
                    autoComplete="off"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-black dark:text-gray-400">
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </div>
                  {isProvDropdownOpen && proveedoresFiltrados.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#2d3748] border border-[#e5e7eb] dark:border-[#4a5568] rounded-lg shadow-lg max-h-60 overflow-y-auto z-40">
                      {proveedoresFiltrados.map((prov) => (
                        <button 
                          key={prov.codigo} 
                          type="button" 
                          onClick={() => {
                            setSelectedProveedor(prov.codigo);
                            setSearchProveedor(prov.codigo);
                            setIsProvDropdownOpen(false);
                          }} 
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#4a5568]"
                        >
                          {prov.codigo} — {prov.razonSocial}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {state.errors?.proveedor && (
                  <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {state.errors.proveedor[0]}
                  </p>
              )}
            </div>

            <InputConIcono
              className="z-10"
              name="fechaVencimiento"
              label="Fecha de Vencimiento"
              icon="event"
              iconBgColor="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
            />

            <TextareaConContador
              className="z-10"
              name="descripcion"
              label="Descripción breve"
              icon="description"
              maxLength={200}
              placeholder="Ingrese detalles adicionales..."
              initialValue={descripcion}
              onValueChange={setDescripcion}
              error={state.errors?.descripcion?.[0]}
            />
          </div>

          <hr className="border-[#e5e7eb] dark:border-[#2d3748] relative z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-0">
            <ToggleSwitch
              label="¿Producto por Peso?"
              descriptionTruphy="Stock en Gramos, precio por Kilo."
              descriptionFalsy="Stock por Unidades, precio Unitario."
              checked={esPorPeso}
              onChange={() => setEsPorPeso(!esPorPeso)}
              className="md:col-span-2"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
              <InputConIcono
                name="stock"
                label={esPorPeso ? "Stock inicial (en Gramos) *" : "Stock inicial (Unidades) *"}
                icon={esPorPeso ? "scale" : "inventory"}
                iconBgColor={esPorPeso ? 'bg-blue-100 text-blue-700' : 'bg-sky-100 text-sky-700'}
                placeholder={esPorPeso ? "Ej. 1500" : "0"}
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                error={state.errors?.stock?.[0]}
                rightElement={esPorPeso ? <span className="text-xs font-bold text-blue-600 mr-2">gr</span> : undefined}
              />

              <InputConIcono
                name="precio"
                label={esPorPeso ? "Precio por Kilo *" : "Precio Unitario *"}
                icon="attach_money"
                iconBgColor={esPorPeso ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                placeholder="0.00"
                step="0.01"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                error={state.errors?.precio?.[0]}
                rightElement={esPorPeso ? <span className="text-xs font-bold text-blue-600 mr-2">/kg</span> : undefined}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#1a202c] border-t border-[#e5e7eb] px-6 py-4 flex flex-col items-end gap-2">
          {state.message && <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-sm w-full text-center">{state.message}</div>}
          <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 w-full">
            <Link
              href="/inventario"
              className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md hover:cursor-pointer"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className={`w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${isPending
                ? 'bg-neutral-500 cursor-not-allowed'
                : 'bg-neutral-800 hover:bg-black hover:scale-105 active:scale-95 hover:shadow-md hover:cursor-pointer dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200'
                }`}
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Guardar Producto
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <AgregarTipoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
