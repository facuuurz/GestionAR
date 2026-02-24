"use client";

import { useState, useEffect, useMemo, useRef } from "react";

// --- COMPONENTE SELECT PERSONALIZADO (OPTIMIZADO) ---
function CustomSelect({ value, options, onChange, disabled = false, gridMode = false, openUp = false }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Buscamos la opción seleccionada actualmente
  const selectedOption = options.find((o: any) => o.value === value) || options[0];
  const selectedLabel = selectedOption ? selectedOption.label : "";

  // Sincronizar el input si el valor cambia desde afuera
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery(selectedLabel);
    }
  }, [selectedLabel, isOpen]);

  // Manejador centralizado para abrir
  const handleOpen = () => {
    if (disabled) return;
    setSearchQuery(""); 
    setIsOpen(true);
  };

  // Manejador centralizado para cerrar
  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery(selectedLabel);
  };

  // Cerrar al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedLabel]);

  // Filtrar opciones
  const filteredOptions = options.filter((opt: any) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (optValue: string, optLabel: string) => {
    onChange(optValue);
    setSearchQuery(optLabel);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${isOpen ? "z-50" : "z-10"}`} ref={dropdownRef}>
      <div
        className={`w-full h-11 px-3 flex items-center justify-between rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#2a2a2a] transition-all ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-neutral-50 dark:bg-[#1a1a1a]"
            : "focus-within:border-neutral-500 focus-within:ring-1 focus-within:ring-neutral-500"
        }`}
      >
        <input
          type="text"
          disabled={disabled}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleOpen}
          onClick={handleOpen}
          className="w-full h-full bg-transparent text-sm font-medium text-neutral-800 dark:text-white outline-none placeholder-neutral-400 disabled:cursor-not-allowed cursor-text"
          placeholder={selectedLabel || "Escribir..."}
        />
        <button 
          type="button" 
          disabled={disabled} 
          onClick={() => {
            if (isOpen) handleClose();
            else handleOpen();
          }}
          className="ml-2 flex items-center justify-center outline-none cursor-pointer"
        >
          <span className={`material-symbols-outlined text-neutral-500 transition-transform duration-200 ${isOpen && !openUp ? "rotate-180" : ""} ${isOpen && openUp ? "rotate-0" : openUp ? "rotate-180" : ""}`}>
            {openUp ? "expand_less" : "expand_more"}
          </span>
        </button>
      </div>

      {/* Lista desplegable */}
      {isOpen && !disabled && (
        <div className={`absolute w-full bg-white dark:bg-[#2a2a2a] border border-neutral-200 dark:border-neutral-600 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] custom-scrollbar animate-in fade-in duration-150 ${
          openUp
            ? "bottom-full mb-2 slide-in-from-bottom-2 origin-bottom"
            : "top-full mt-2 slide-in-from-top-2 origin-top"
        }`}>
          
          {filteredOptions.length === 0 ? (
            <div className="p-4 text-center text-sm text-neutral-500">
              No se encontraron resultados
            </div>
          ) : gridMode ? (
            <div className="p-2 bg-white dark:bg-[#2a2a2a] rounded-lg">
              <div className="grid grid-cols-7 gap-1 max-h-[16rem] overflow-y-auto custom-scrollbar">
                {filteredOptions.map((opt: any) => {
                  const isSelected = value === opt.value;
                  if (opt.value === "Todos") {
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value, opt.label)}
                        className={`col-span-7 px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors text-left flex items-center justify-between ${
                          isSelected
                            ? "bg-primary/10 text-primary dark:bg-white/10 dark:text-white"
                            : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#333]"
                        }`}
                      >
                        {opt.label}
                        {isSelected && <span className="material-symbols-outlined text-[16px]">check</span>}
                      </button>
                    );
                  }
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value, opt.label)}
                      className={`h-9 w-full flex items-center justify-center text-sm rounded-md transition-colors ${
                        isSelected
                          ? "bg-neutral-800 text-white dark:bg-white dark:text-black font-bold shadow-sm"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#333]"
                      }`}
                    >
                      {opt.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <ul className="max-h-[13.5rem] overflow-y-auto py-1 custom-scrollbar bg-white dark:bg-[#2a2a2a] rounded-lg">
              {filteredOptions.map((opt: any) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt.value, opt.label)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                    value === opt.value
                      ? "bg-primary/10 text-primary dark:bg-white/10 dark:text-white font-bold"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-[#333]"
                  }`}
                >
                  {opt.label}
                  {value === opt.value && (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// --- MODAL PRINCIPAL ---
export default function FiltroFechaModal({ isOpen, onClose, onApply, currentFilter }: any) {
  const [year, setYear] = useState("Todos");
  const [month, setMonth] = useState("Todos");
  const [day, setDay] = useState("Todos");

  useEffect(() => {
    if (isOpen && currentFilter) {
      setYear(currentFilter.year || "Todos");
      setMonth(currentFilter.month || "Todos");
      setDay(currentFilter.day || "Todos");
    }
  }, [isOpen, currentFilter]);

  // --- MODIFICACIÓN: Años ascendentes desde 2026 hasta 2099 ---
  const opcionesAnios = useMemo(() => {
    const options = [{ value: "Todos", label: "Todos los años" }];
    for (let i = 2026; i <= 2099; i++) {
      options.push({ value: i.toString(), label: i.toString() });
    }
    return options;
  }, []);

  const opcionesMeses = [
    { value: "Todos", label: "Todos los meses" },
    { value: "01", label: "Enero" }, { value: "02", label: "Febrero" },
    { value: "03", label: "Marzo" }, { value: "04", label: "Abril" },
    { value: "05", label: "Mayo" }, { value: "06", label: "Junio" },
    { value: "07", label: "Julio" }, { value: "08", label: "Agosto" },
    { value: "09", label: "Septiembre" }, { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" }
  ];

  const diasDelMes = useMemo(() => {
    if (month === "Todos") return 31;
    // --- MODIFICACIÓN: Usamos 2028 (año bisiesto) como fallback para Febrero cuando está en "Todos los años"
    const anioCalculo = year === "Todos" ? 2028 : parseInt(year);
    const mesCalculo = parseInt(month);
    return new Date(anioCalculo, mesCalculo, 0).getDate();
  }, [month, year]);

  const opcionesDias = useMemo(() => {
    const options = [{ value: "Todos", label: "Todos los días" }];
    for (let i = 1; i <= diasDelMes; i++) {
      const numStr = i.toString().padStart(2, '0');
      options.push({ value: numStr, label: numStr });
    }
    return options;
  }, [diasDelMes]);

  useEffect(() => {
    if (day !== "Todos" && parseInt(day) > diasDelMes) {
      setDay("Todos");
    }
  }, [diasDelMes, day]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ year, month, day });
    onClose();
  };

  const handleReset = () => {
    setYear("Todos");
    setMonth("Todos");
    setDay("Todos");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-sm bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-visible animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-700 dark:text-white">calendar_month</span>
            <h3 className="text-lg font-bold text-primary dark:text-white">Filtrar por Fecha</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer hover:scale-110 active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Año</label>
            <CustomSelect
              value={year}
              options={opcionesAnios}
              onChange={setYear}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Mes</label>
            <CustomSelect
              value={month}
              options={opcionesMeses}
              onChange={setMonth}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Día</label>
            <CustomSelect
              value={day}
              options={opcionesDias}
              onChange={setDay}
              disabled={month === "Todos" && year === "Todos"}
              gridMode={true}
              openUp={true}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-between gap-3 rounded-b-2xl mt-2 relative z-0">
           <button
             onClick={handleReset}
             className="h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300 transition-all hover:scale-105 active:scale-95 cursor-pointer dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
           >
             <span className="material-symbols-outlined text-[18px]">restart_alt</span>
             Restablecer
           </button>

            <button
                onClick={handleApply}
                className="h-10 px-6 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 dark:bg-white dark:text-black"
            >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Aplicar
            </button>
        </div>
      </div>
    </div>
  );
}