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


📄 Licencia
Este proyecto está bajo la Licencia MIT.