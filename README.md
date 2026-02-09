GestionAR - Sistema de Gestión de Inventario y Ventas

GestionAR es una aplicación web diseñada para la gestión de pequeños y medianos comercios. Permite administrar inventario, proveedores, cuentas corrientes y realizar ventas, soportando tanto productos unitarios como productos vendidos por peso (granel).

Este proyecto está optimizado para la nube, utilizando Vercel para el despliegue del frontend/backend y Neon como base de datos PostgreSQL serverless.

	Tecnologías Utilizadas

Framework: Next.js 

Despliegue: Vercel

Lenguaje: TypeScript

Estilos: Tailwind CSS (con soporte para Dark Mode)

Base de Datos (Cloud): PostgreSQL gestionado por Neon

ORM: Prisma

Validación de Datos: Zod


	Características Principales

1. Gestión de Inventario
CRUD Completo: Crear, leer, actualizar y eliminar productos.

Soporte Híbrido: Manejo de productos por Unidad y por Peso (Kg/Gr).

Lógica de Peso: Conversión automática de precios y stock (gramos a kilos visualmente).

Filtrado: Búsqueda en tiempo real, filtros por categoría, stock bajo y rango de precios.

Alertas: Indicadores visuales (semáforo) para stock bajo y productos vencidos.

2. Gestión de Venta
Buscador Inteligente: Búsqueda rápida de productos y clientes.

Carrito de Compras: Adición rápida de productos unitarios.

Gestión de Clientes: Asignación de ventas a clientes registrados o consumidor final.

3. Proveedores
Gestión de base de datos de proveedores y vinculación con productos.


	Estructura del Proyecto

src/app: Rutas y páginas de la aplicación (App Router).

src/actions: Server Actions para lógica de backend (CRUD, validaciones).

src/components: Componentes de UI reutilizables.

prisma/schema.prisma: Esquema de la base de datos (PostgreSQL).


	Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu entorno local conectándote a tu base de datos en Neon:


- Clonar el repositorio:

git clone https://github.com/tu-usuario/gestionar.git

cd gestionar


- Instalar dependencias:

npm install


- Configurar Variables de Entorno: Crea un archivo .env en la raíz del proyecto. Necesitarás tu cadena de conexión de Neon Console:
 
# Obtén esto en tu Dashboard de Neon:

DATABASE_URL="postgres://usuario:password@ep-tu-endpoint.us-east-2.aws.neon.tech/neondb?sslmode=require"


- Sincronizar la Base de Datos (Prisma): Esto aplicará el esquema a tu base de datos en Neon y generará el cliente.

npx prisma db push
npx prisma generate


-Ejecutar el servidor de desarrollo:

npm run dev

- Abre http://localhost:3000 en tu navegador.


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
