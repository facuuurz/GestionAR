import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header";
import { getSession } from "@/lib/session";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],       
  variable: "--font-jakarta", 
  display: "swap",
});

export const metadata: Metadata = {
  title: "GestionAR - Inicio",
  description: "Sistema de gestión administrativa",
  icons: {
    icon: "/icon.png", // <--- Next.js ya sabe que debe buscar en 'public'
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className={`antialiased ${jakarta.variable}`}>
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f7f7f7] dark:bg-[#191919] overflow-x-hidden">
          
          <Header session={session} />
          
          {/* CAMBIO AQUI: Agregamos 'pt-20' para que el contenido no quede tapado por el header fijo */}
          <main className={`flex-1 ${session ? 'pt-16' : ''}`}>
            {children}
          </main>

          {session && (
            <footer className="flex flex-col gap-6 px-5 py-10 text-center border-t border-[#ededed] dark:border-[#333]">
              <p className="text-neutral-400 text-sm font-normal">
                © {new Date().getFullYear()} GestionAR Inc. Todos los derechos reservados.
              </p>
            </footer>
          )}
        </div>
      </body>
    </html>
  );
}