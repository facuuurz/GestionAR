import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession, updateSession } from "./lib/session";

// Rutas protegidas que requieren sesión
// Empleados y Admin tienen acceso
const protectedRoutes = ["/", "/inventario", "/ventas", "/promociones", "/cuentas-corrientes", "/proveedores", "/panel", "/manual"];

// Rutas exclusivamente para Administradores
const adminRoutes = ["/empleados"];

// Rutas públicas
const publicRoutes = ["/login"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(route + "/"));
  const isAdminRoute = adminRoutes.some((route) => path === route || path.startsWith(route + "/"));
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(route + "/"));

  const session = await getSession();

  // Si trata de acceder a una ruta protegida sin sesión, va al login
  if (!session && (isProtectedRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Si trata de acceder a una ruta de admin y no es admin ni superadmin, redirige al inicio
  if (session && isAdminRoute && session.role !== "ADMIN" && session.role !== "SUPERADMIN") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Si tiene sesión activa e intenta ir al login, redirige al inicio
  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Actualizar expiración de la cookie
  if (session) {
    const res = NextResponse.next();
    // Actualizamos la sesión mediante un utilitario manual si hiciera falta, 
    // pero `updateSession` internamente llama a `cookies().set`, 
    // lo caul en middleware requiere clonar headers. Afortunadamente, Next.js provee esto nativamente
    // Pero la mejor práctica en Next.js App Router es refrescar en Server Actions o Layout.
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
