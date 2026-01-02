import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header/Header"; // Usando el alias @ configurado en tu tsconfig
import {Plus_Jakarta_Sans} from "next/font/google";


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],       
  variable: "--font-jakarta", 
  display: "swap",
});

export const metadata: Metadata = {
  title: "GestionAR - Inicio",
  description: "Sistema de gestión administrativa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Iconos */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className={`antialiased ${jakarta.variable}`}>
        <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f7f7f7] dark:bg-[#191919] overflow-x-hidden">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <footer className="flex flex-col gap-6 px-5 py-10 text-center border-t border-[#ededed] dark:border-[#333]">
            <p className="text-neutral-400 text-sm font-normal">
              © {new Date().getFullYear()} GestionAR Inc. Todos los derechos reservados.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}