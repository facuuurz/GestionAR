# GestionAR

## 📖 ¿Qué es GestionAR?
GestionAR es una plataforma integral de gestión de negocios y administración, diseñada para facilitar el control operativo integral de una empresa. Permite a los usuarios administrar de manera centralizada y eficiente su inventario de productos, registrar y consultar ventas, gestionar cuentas corrientes de clientes, controlar el directorio de proveedores y configurar promociones. Además, la plataforma se distingue por contar con un **Asistente Inteligente basado en Inteligencia Artificial (ChatBot)** que interactúa directamente con los datos del sistema para responder consultas gerenciales, cruzar información y proporcionar reportes en tiempo real.

## 🛠️ Tecnologías Utilizadas
Este proyecto está construido sobre un stack moderno y escalable:

- **Framework Principal:** [Next.js](https://nextjs.org/) (Versión 16) con [React](https://react.dev/) 19.
- **Base de Datos y ORM:** PostgreSQL, gestionado a través de [Prisma ORM](https://www.prisma.io/).
- **Estilos y UI:** [TailwindCSS](https://tailwindcss.com/) v4 y componentes base de [Shadcn UI](https://ui.shadcn.com/), con animaciones impulsadas por `motion` y `tw-animate-css`.
- **Inteligencia Artificial:** Asistente integrado con **Google Gemini** usando el [Vercel AI SDK](https://sdk.vercel.ai/).
- **Validación de Datos:** [Zod](https://zod.dev/).
- **Autenticación y Seguridad:** `bcryptjs` y `jose` (JWT).
- **Reportes y Exportaciones:** Generación de PDFs y Tablas usando `jspdf` y `jspdf-autotable`, y exportaciones Excel con `xlsx`.
- **Envío de Correos:** [Nodemailer](https://nodemailer.com/).
- **Tareas Programadas (Cron Jobs):** `node-cron`.

## ✨ Características Principales
- **🤖 Asistente de IA (ChatBot):** Consulta el estado de tu negocio y obtén reportes cruzados con lenguaje natural usando herramientas de IA.
- **📦 Gestión de Inventario:** Búsqueda avanzada de productos, control de stock mínimo, gestión por categorías y proveedores.
- **💰 Registro de Ventas:** Historial detallado de operaciones, posibilidad de filtrar por márgenes de tiempo, montos y clientes.
- **👥 Cuentas Corrientes y Clientes:** Monitorea el estado de deuda de los clientes ("Al Día", "Moroso") y los saldos disponibles.
- **🤝 Control de Proveedores:** Mantén un directorio completo y el estado activo/inactivo de tus proveedores.
- **🎁 Promociones Automatizadas:** Gestión de descuentos y promociones con fechas de inicio/fin automatizadas.
- **📄 Exportación de Informes:** Soporte para descargas en PDF y archivos de hoja de cálculo (Excel).

## 🚀 Guía de Instalación del Proyecto

### ¿Qué se necesita? (Requisitos Previos)
Antes de comenzar, asegúrate de tener instalados los siguientes componentes en tu sistema:
- **Node.js** (Versión 18+ o superior, se recomienda la última versión LTS).
- **npm** (Viene con Node.js) o bien `yarn` / `pnpm`.
- **PostgreSQL**: Una base de datos PostgreSQL activa de manera local o un clúster en la nube (por ejemplo, Supabase, Neon, AWS RDS, etc.).

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd GestionAR
   ```

2. **Instalar Dependencias**
   Ejecuta el siguiente comando para instalar todos los paquetes y dependencias del proyecto:
   ```bash
   npm install
   ```

3. **Configurar el Entorno**
   - Crea un archivo `.env` en la raíz del proyecto (puedes basarte en un `.env.example` si existe).
   - Define las siguientes variables de entorno requeridas:
     ```env
     # Base de datos PostgreSQL
     DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/gestionar_db?schema=public"
     
     # Claves para integrar IA Gemini (Vercel AI SDK)
     GOOGLE_GENERATIVE_AI_API_KEY="tu_api_key_de_google_gemini"

     # Seguridad / JWT
     JWT_SECRET="tu_clave_secreta_super_segura"
     ```

4. **Preparar la Base de Datos con Prisma**
   Aplica la estructura de base de datos a tu base de datos PostgreSQL corriendo las migraciones:
   ```bash
   npx prisma migrate dev
   ```
   *(Opcional) Si quieres generar únicamente el cliente de prisma sin migrar, corre `npx prisma generate`*.

5. **Iniciar el Servidor de Desarrollo**
   Arranca la aplicación Next.js localmente:
   ```bash
   npm run dev
   ```
   El servidor debería inicializarse en `http://localhost:3000`.

6. **Compilación para Producción (Opcional)**
   Si necesitas hacer deploy de la aplicación:
   ```bash
   npm run build
   npm run start
   ```
