import React from "react";
import LoginForm from "@/app/login/LoginForm";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Image from "next/image";

export const metadata = {
  title: "Iniciar Sesión | GestionAR",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-300 relative overflow-hidden font-sans antialiased text-gray-900">
      <main className="w-full max-w-md px-4">
        <section className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
          {/* Logo and Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                GestionAR
              </h1>
              <Image src="/icon.png" alt="Logo" width={36} height={36} className="object-contain" />
            </div>
            <p className="text-sm text-gray-500 text-center">¡La mejor gestión de tu negocio está aquí!</p>
          </div>
          <React.Suspense fallback={<div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div></div>}>
            <LoginForm />
          </React.Suspense>
        </section>
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2026 GestionAR Inc. Todos los derechos reservados.
        </p>
      </main>
    </div>
  );
}
