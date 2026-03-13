"use client";

import { useState, useEffect } from "react";
import { getLocalBackups, restoreLocalBackup, restoreFromBackup } from "@/actions/restore";

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackupRestoreModal({ isOpen, onClose }: BackupRestoreModalProps) {
  const [backups, setBackups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<string>("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadBackups();
    } else {
      setMessage(null);
      setSelectedBackup("");
    }
  }, [isOpen]);

  const loadBackups = async () => {
    const result = await getLocalBackups();
    if (result.success && result.backups) {
      setBackups(result.backups);
      if (result.backups.length > 0) {
        setSelectedBackup(result.backups[0]); // Seleccionar el más reciente por defecto
      }
    }
  };

  const handleRestoreServer = async () => {
    if (!selectedBackup) return;
    setLoading(true);
    setMessage(null);

    const res = await restoreLocalBackup(selectedBackup);
    if (res.success) {
      setMessage({ text: res.message, type: "success" });
    } else {
      setMessage({ text: res.message, type: "error" });
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        if (content) {
          const res = await restoreFromBackup(content);
          if (res.success) {
            setMessage({ text: res.message, type: "success" });
          } else {
            setMessage({ text: res.message, type: "error" });
          }
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setMessage({ text: "Error leyendo el archivo", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-xl p-6 w-full max-w-lg flex flex-col gap-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">settings_backup_restore</span>
          Recuperación de Backup
        </h2>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cargar el último backup (Automático)
            </label>
            {backups.length > 0 ? (
              <div className="flex items-center gap-2">
                <select
                  value={selectedBackup}
                  onChange={(e) => setSelectedBackup(e.target.value)}
                  className="flex-1 w-0 truncate p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-[#2a2a2a] outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                >
                  {backups.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleRestoreServer}
                  disabled={loading}
                  className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg font-medium hover:bg-black/80 dark:hover:bg-gray-200 transition disabled:opacity-50"
                >
                  {loading ? "..." : "Restaurar"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay backups locales disponibles.</p>
            )}
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="shrink-0 px-4 text-sm text-gray-400">O cargar archivo</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subir archivo JSON
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={loading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 dark:file:bg-[#2a2a2a] dark:file:text-white dark:hover:file:bg-gray-700 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
