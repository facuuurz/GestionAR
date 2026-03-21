import { resetPassword } from "@/lib/resetPassword";
import ResetForm from "./ResetForm";
import Image from "next/image";
import { BeamsBackground } from "@/components/ui/beams-background";

export const metadata = {
  title: "Restablecer Contraseña | GestionAR",
};

export default async function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = await params;

  return (
    <BeamsBackground className="font-sans antialiased text-gray-900">
      <main className="w-full max-w-md px-4 relative z-10 flex flex-col items-center justify-center">
        <section className="bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_30px_70px_rgba(0,0,0,0.4)] w-full">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                GestionAR
              </h1>
              <Image
                src="/icon.png"
                alt="Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Ingresá tu nueva contraseña para recuperar el acceso.
            </p>
          </div>

          <ResetForm token={token} resetPassword={resetPassword} />
        </section>

        <p className="text-center text-xs text-neutral-400 mt-6 relative z-10">
          © 2026 GestionAR Inc. Todos los derechos reservados.
        </p>
      </main>
    </BeamsBackground>
  );
}
