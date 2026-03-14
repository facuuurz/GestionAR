import LoginForm from "@/app/login/LoginForm";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Iniciar Sesión | GestionAR",
};

export default async function LoginPage() {
  const session = await getSession();
  
  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px]" />
      
      <div className="z-10 w-full max-w-md p-8 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            GestionAR
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Ingresa a tu cuenta para continuar</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
