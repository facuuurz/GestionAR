"use client";

import { useState, useTransition } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
  resetPassword: (
    token: string,
    newPassword: string
  ) => Promise<{ success?: boolean; message?: string; error?: string }>;
}

// Reglas de validación
const rules = [
  { label: "Al menos 8 caracteres", test: (p: string) => p.length >= 8 },
  { label: "Una letra mayúscula (A-Z)", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Un número (0-9)", test: (p: string) => /[0-9]/.test(p) },
  { label: "Un símbolo especial ($, @, #, !...)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetForm({ token, resetPassword }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const passedRules = rules.filter((r) => r.test(password));
  const allRulesPassed = passedRules.length === rules.length;
  const mismatch = password && confirm && password !== confirm;
  const canSubmit = allRulesPassed && confirm && !mismatch && !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    startTransition(async () => {
      const res = await resetPassword(token, password);
      setResult(res);
    });
  };

  if (result?.success) {
    return (
      <div className="text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <p className="text-gray-700 font-medium">{result.message}</p>
        <button
          onClick={() => router.push("/login")}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-200"
        >
          Ir al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nueva contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 ml-1">
          Nueva contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all duration-200"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Indicador de fortaleza */}
        {password && (
          <ul className="mt-3 space-y-1.5">
            {rules.map((rule) => {
              const ok = rule.test(password);
              return (
                <li key={rule.label} className={`flex items-center gap-2 text-xs ${ok ? "text-green-600" : "text-gray-400"}`}>
                  {ok ? <Check className="h-3.5 w-3.5 flex-shrink-0" /> : <X className="h-3.5 w-3.5 flex-shrink-0" />}
                  {rule.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2 ml-1">
          Confirmar contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            placeholder="Repetí la contraseña"
            className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200 ${
              mismatch
                ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                : "border-gray-200 focus:ring-black focus:border-black"
            }`}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {mismatch && (
          <p className="text-xs text-red-500 mt-1.5 ml-1">Las contraseñas no coinciden.</p>
        )}
      </div>

      {/* Error del servidor */}
      {result?.error && (
        <div className="text-red-500 text-sm bg-red-50 border border-red-200 py-2 px-3 rounded-lg">
          {result.error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          "Restablecer contraseña"
        )}
      </button>
    </form>
  );
}
