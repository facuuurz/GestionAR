"use server";

export interface ManualSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
}

// Simulamos una base de datos de secciones del manual
const manualData: ManualSection[] = [
  {
    id: "ventas",
    title: "Ventas",
    icon: "shopping_cart",
    description: "Aprende a registrar y administrar las ventas diarias.",
    content: `
      ### Módulo de Ventas
      El módulo de ventas te permite registrar cada transacción realizada en el negocio de manera rápida y segura. 
      
      **¿Cómo usarlo?**
      1. Busca el producto por nombre o código de barras.
      2. Agrega la cantidad deseada al carrito.
      3. Selecciona el método de pago (Efectivo, Tarjeta, Transferencia).
      4. Confirma la venta para generar el comprobante.
      
      *Tip: Asegúrate de tener stock suficiente antes de confirmar una venta grande.*
    `
  },
  {
    id: "inventario",
    title: "Inventario",
    icon: "inventory_2",
    description: "Controla el stock, precios y categorías de tus productos.",
    content: `
      ### Módulo de Inventario
      Mantén el control total de tus existencias. Este módulo es el corazón de GestionAR.
      
      **Funciones principales:**
      - **Alta de productos:** Crea nuevos productos especificando costo, margen de ganancia y stock inicial.
      - **Actualización masiva:** Modifica precios por categoría o proveedor fácilmente.
      - **Alertas de stock:** El sistema te avisará cuando un producto esté por agotarse.
    `
  },
  {
    id: "cuentas-corrientes",
    title: "Cuentas Corrientes",
    icon: "account_balance_wallet",
    description: "Gestiona los saldos a favor o en contra de tus clientes de confianza.",
    content: `
      ### Cuentas Corrientes
      Ideal para gestionar fiados o pagos parciales de clientes recurrentes.
      
      **¿Cómo funciona?**
      1. Al hacer una venta, selecciona "Cuenta Corriente" como método de pago y asígnala a un cliente.
      2. El saldo se acumulará en la ficha del cliente.
      3. Puedes registrar "Pagos" o "Entregas" para ir descontando la deuda.
      
      *Importante: Establece límites de crédito para evitar deudas excesivas.*
    `
  },
  {
    id: "promociones",
    title: "Promociones",
    icon: "local_offer",
    description: "Crea descuentos atractivos para potenciar tus ventas.",
    content: `
      ### Creador de Promociones
      Atrae más clientes creando ofertas temporales o por cantidad.
      
      **Tipos de promociones soportadas:**
      - **Porcentaje de descuento:** Ej. 20% OFF en toda la categoría Lacteos.
      - **2x1 o 3x2:** Lleva N y paga M.
      - **Descuento por método de pago:** Ej. 10% de descuento abonando en Efectivo.
      
      Las promociones se aplicarán automáticamente en el módulo de Ventas cuando se cumplan las condiciones.
    `
  },
  {
    id: "proveedores",
    title: "Proveedores",
    icon: "local_shipping",
    description: "Administra los contactos y pedidos a tus distribuidores.",
    content: `
      ### Gestión de Proveedores
      Centraliza la información de quienes abastecen tu negocio.
      
      **¿Qué puedes hacer?**
      - Guardar datos de contacto (Teléfono, Email, Dirección, Días de visita).
      - Relacionar productos con proveedores específicos para saber a quién pedir reposición.
      - Registrar el historial de compras y remitos recibidos.
    `
  }
];

export async function getManualSections(): Promise<Omit<ManualSection, 'content'>[]> {
  // Simulamos delay de red (como en inventario)
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // Devolvemos la lista sin el contenido pesado para el sidebar
  return manualData.map(({ id, title, icon, description }) => ({
    id, title, icon, description
  }));
}

export async function getManualContentById(id: string): Promise<ManualSection | null> {
  // Simulamos delay de red
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const section = manualData.find(s => s.id === id);
  return section || null;
}

export async function searchManual(query: string): Promise<ManualSection[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const q = query.toLowerCase();
  return manualData.filter(s => 
    s.title.toLowerCase().includes(q) || 
    s.description.toLowerCase().includes(q) ||
    s.content.toLowerCase().includes(q)
  );
}
