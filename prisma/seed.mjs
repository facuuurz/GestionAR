import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Cargando datos de prueba...\n');

  // ========== 5 PROVEEDORES ==========
  const proveedores = await Promise.all([
    prisma.proveedor.create({
      data: { codigo: 'PROV-001', razonSocial: 'Distribuidora del Norte SA', contacto: 'Carlos Méndez', telefono: '011-4555-1234', email: 'ventas@delnorte.com.ar' },
    }),
    prisma.proveedor.create({
      data: { codigo: 'PROV-002', razonSocial: 'Alimentos Pampeanos SRL', contacto: 'Laura García', telefono: '011-4666-5678', email: 'contacto@pampeanos.com.ar' },
    }),
    prisma.proveedor.create({
      data: { codigo: 'PROV-003', razonSocial: 'Bebidas del Sur SA', contacto: 'Martín López', telefono: '0351-488-9012', email: 'info@bebidasdelsur.com.ar' },
    }),
    prisma.proveedor.create({
      data: { codigo: 'PROV-004', razonSocial: 'Lácteos La Esperanza', contacto: 'Ana Rodríguez', telefono: '02323-45-6789', email: 'pedidos@laesperanza.com.ar' },
    }),
    prisma.proveedor.create({
      data: { codigo: 'PROV-005', razonSocial: 'Golosinas y Snacks Argentinos', contacto: 'Roberto Fernández', telefono: '011-4777-3456', email: 'ventas@golosinasarg.com.ar' },
    }),
  ]);
  console.log(`✅ ${proveedores.length} proveedores creados`);

  // ========== 25 PRODUCTOS ==========
  const productosData = [
    { nombre: 'Coca-Cola 2.25L', codigoBarra: '7790895000119', descripcion: 'Gaseosa Coca-Cola 2.25 litros', tipo: 'Bebidas', proveedor: 'PROV-003', stock: 48, precio: 2500.00, esPorPeso: false },
    { nombre: 'Pepsi 1.5L', codigoBarra: '7791813420309', descripcion: 'Gaseosa Pepsi 1.5 litros', tipo: 'Bebidas', proveedor: 'PROV-003', stock: 36, precio: 1800.00, esPorPeso: false },
    { nombre: 'Agua Mineral Villavicencio 1.5L', codigoBarra: '7792799000011', descripcion: 'Agua mineral sin gas', tipo: 'Bebidas', proveedor: 'PROV-003', stock: 60, precio: 1200.00, esPorPeso: false },
    { nombre: 'Cerveza Quilmes Lata 473ml', codigoBarra: '7792798001019', descripcion: 'Cerveza lager en lata', tipo: 'Bebidas', proveedor: 'PROV-003', stock: 72, precio: 1500.00, esPorPeso: false },
    { nombre: 'Leche La Serenísima 1L', codigoBarra: '7790742000101', descripcion: 'Leche entera en sachet', tipo: 'Lácteos', proveedor: 'PROV-004', stock: 30, precio: 1100.00, esPorPeso: false },
    { nombre: 'Yogur Activia Natural 190g', codigoBarra: '7791337000101', descripcion: 'Yogur natural probiótico', tipo: 'Lácteos', proveedor: 'PROV-004', stock: 24, precio: 950.00, esPorPeso: false },
    { nombre: 'Queso Cremoso', codigoBarra: '7790001234501', descripcion: 'Queso cremoso por kg', tipo: 'Lácteos', proveedor: 'PROV-004', stock: 15, precio: 8500.00, esPorPeso: true },
    { nombre: 'Pan Lactal Bimbo', codigoBarra: '7790040010109', descripcion: 'Pan lactal grande', tipo: 'Panadería', proveedor: 'PROV-001', stock: 20, precio: 2200.00, esPorPeso: false },
    { nombre: 'Galletitas Oreo', codigoBarra: '7622210100108', descripcion: 'Galletitas rellenas de chocolate', tipo: 'Galletitas', proveedor: 'PROV-005', stock: 40, precio: 1600.00, esPorPeso: false },
    { nombre: 'Galletitas Criollitas', codigoBarra: '7790040550100', descripcion: 'Galletitas de agua', tipo: 'Galletitas', proveedor: 'PROV-005', stock: 35, precio: 900.00, esPorPeso: false },
    { nombre: 'Arroz Gallo Oro 1kg', codigoBarra: '7790070011015', descripcion: 'Arroz largo fino', tipo: 'Almacén', proveedor: 'PROV-002', stock: 50, precio: 1800.00, esPorPeso: false },
    { nombre: 'Fideos Matarazzo 500g', codigoBarra: '7790272000107', descripcion: 'Fideos tirabuzón', tipo: 'Almacén', proveedor: 'PROV-002', stock: 45, precio: 1200.00, esPorPeso: false },
    { nombre: 'Aceite Natura 1.5L', codigoBarra: '7790272001517', descripcion: 'Aceite de girasol', tipo: 'Almacén', proveedor: 'PROV-002', stock: 25, precio: 3200.00, esPorPeso: false },
    { nombre: 'Azúcar Ledesma 1kg', codigoBarra: '7790360001019', descripcion: 'Azúcar blanca', tipo: 'Almacén', proveedor: 'PROV-002', stock: 40, precio: 1400.00, esPorPeso: false },
    { nombre: 'Yerba Mate Taragüí 1kg', codigoBarra: '7790387010107', descripcion: 'Yerba mate con palo', tipo: 'Infusiones', proveedor: 'PROV-001', stock: 30, precio: 4500.00, esPorPeso: false },
    { nombre: 'Café Dolca Instantáneo 170g', codigoBarra: '7613036045100', descripcion: 'Café instantáneo', tipo: 'Infusiones', proveedor: 'PROV-001', stock: 18, precio: 5200.00, esPorPeso: false },
    { nombre: 'Jamón Cocido', codigoBarra: '7790001234601', descripcion: 'Jamón cocido por kg', tipo: 'Fiambrería', proveedor: 'PROV-001', stock: 10, precio: 12000.00, esPorPeso: true },
    { nombre: 'Salame Tipo Milán', codigoBarra: '7790001234701', descripcion: 'Salame cortado por kg', tipo: 'Fiambrería', proveedor: 'PROV-001', stock: 8, precio: 14000.00, esPorPeso: true },
    { nombre: 'Detergente Magistral 500ml', codigoBarra: '7506306233515', descripcion: 'Detergente líquido', tipo: 'Limpieza', proveedor: 'PROV-001', stock: 20, precio: 2800.00, esPorPeso: false },
    { nombre: 'Lavandina Ayudín 1L', codigoBarra: '7790580010102', descripcion: 'Lavandina concentrada', tipo: 'Limpieza', proveedor: 'PROV-001', stock: 22, precio: 1500.00, esPorPeso: false },
    { nombre: 'Papel Higiénico Elegante x4', codigoBarra: '7790250051047', descripcion: 'Papel higiénico doble hoja', tipo: 'Limpieza', proveedor: 'PROV-001', stock: 30, precio: 2600.00, esPorPeso: false },
    { nombre: 'Chocolates Bon o Bon x30', codigoBarra: '7790580019143', descripcion: 'Caja de bombones', tipo: 'Golosinas', proveedor: 'PROV-005', stock: 12, precio: 7500.00, esPorPeso: false },
    { nombre: 'Papas Fritas Lays 270g', codigoBarra: '7790310982105', descripcion: 'Papas fritas clásicas', tipo: 'Snacks', proveedor: 'PROV-005', stock: 28, precio: 3800.00, esPorPeso: false },
    { nombre: 'Huevos Blancos x12', codigoBarra: '7790001234801', descripcion: 'Maple de huevos blancos', tipo: 'Almacén', proveedor: 'PROV-002', stock: 20, precio: 3500.00, esPorPeso: false },
    { nombre: 'Manteca La Paulina 200g', codigoBarra: '7790001234901', descripcion: 'Manteca de primera calidad', tipo: 'Lácteos', proveedor: 'PROV-004', stock: 15, precio: 2800.00, esPorPeso: false },
  ];

  const productos = [];
  for (const p of productosData) {
    const prod = await prisma.producto.create({ data: p });
    productos.push(prod);
  }
  console.log(`✅ ${productos.length} productos creados`);

  // ========== 10 CUENTAS CORRIENTES ==========
  const cuentasData = [
    { nombre: 'Juan Pérez', cuit: '20-30123456-7', telefono: '011-4321-5678', email: 'jperez@mail.com', direccion: 'Av. Rivadavia 1234', ciudad: 'CABA', saldo: 15000.00, estado: 'Al Día' },
    { nombre: 'María González', cuit: '27-28654321-0', telefono: '011-5555-4321', email: 'mgonzalez@mail.com', direccion: 'Calle San Martín 567', ciudad: 'Morón', saldo: -3200.50, estado: 'Deudor', saldoNegativoDesde: new Date('2026-03-01') },
    { nombre: 'Almacén Don Raúl', cuit: '30-71234567-8', telefono: '011-4888-7654', email: 'almacenraul@mail.com', direccion: 'Av. Corrientes 890', ciudad: 'CABA', saldo: 52000.00, estado: 'Al Día' },
    { nombre: 'Kiosco La Esquina', cuit: '20-35678901-2', telefono: '0351-456-7890', email: 'laesquina@mail.com', direccion: 'Esquina 12 de Octubre y Colón', ciudad: 'Córdoba', saldo: 0.00, estado: 'Al Día' },
    { nombre: 'Supermercado Barrio Norte', cuit: '30-72345678-9', telefono: '011-4999-1234', email: 'barrionorte@mail.com', direccion: 'Av. Santa Fe 2345', ciudad: 'CABA', saldo: -12500.00, estado: 'Deudor', saldoNegativoDesde: new Date('2026-02-15') },
    { nombre: 'Restaurante El Buen Sabor', cuit: '30-73456789-0', telefono: '011-4111-2222', email: 'elbuensabor@mail.com', direccion: 'Calle Defensa 456', ciudad: 'CABA', saldo: 89000.00, estado: 'Al Día' },
    { nombre: 'Pedro Ramírez', cuit: '20-32456789-3', telefono: '0341-456-1234', email: 'pramirez@mail.com', direccion: 'Bv. Oroño 1890', ciudad: 'Rosario', saldo: 4500.75, estado: 'Al Día' },
    { nombre: 'Despensa Los Amigos', cuit: '30-74567890-1', telefono: '0221-467-8901', email: 'losamigos@mail.com', direccion: 'Calle 7 N° 1234', ciudad: 'La Plata', saldo: -800.00, estado: 'Deudor', saldoNegativoDesde: new Date('2026-03-10') },
    { nombre: 'Carolina Suárez', cuit: '27-29876543-5', telefono: '011-5678-9012', email: 'csuarez@mail.com', direccion: 'Av. Cabildo 3456', ciudad: 'CABA', saldo: 22000.00, estado: 'Al Día' },
    { nombre: 'Autoservicio El Progreso', cuit: '30-75678901-2', telefono: '011-4222-3333', email: 'elprogreso@mail.com', direccion: 'Av. Maipú 789', ciudad: 'Vicente López', saldo: 7800.00, estado: 'Al Día' },
  ];

  const cuentas = [];
  for (const c of cuentasData) {
    const cuenta = await prisma.cuenta_corriente.create({ data: c });
    cuentas.push(cuenta);
  }
  console.log(`✅ ${cuentas.length} cuentas corrientes creadas`);

  // ========== 7 PROMOCIONES (con productos asociados) ==========
  const hoy = new Date();
  const enUnMes = new Date(hoy);
  enUnMes.setMonth(enUnMes.getMonth() + 1);
  const enDosMeses = new Date(hoy);
  enDosMeses.setMonth(enDosMeses.getMonth() + 2);
  const haceUnaSemana = new Date(hoy);
  haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);

  const promocionesData = [
    {
      nombre: 'Combo Bebidas Verano',
      descripcion: '2 Coca-Cola + 1 Agua Mineral a precio especial',
      precio: 5500.00,
      activo: true,
      fechaInicio: hoy,
      fechaFin: enUnMes,
      items: { create: [
        { productoId: productos[0].id, cantidad: 2 }, // Coca-Cola
        { productoId: productos[2].id, cantidad: 1 }, // Agua Mineral
      ]},
    },
    {
      nombre: 'Desayuno Completo',
      descripcion: 'Pan Lactal + Manteca + Leche',
      precio: 4800.00,
      activo: true,
      fechaInicio: hoy,
      fechaFin: enDosMeses,
      items: { create: [
        { productoId: productos[7].id, cantidad: 1 },  // Pan Lactal
        { productoId: productos[24].id, cantidad: 1 }, // Manteca
        { productoId: productos[4].id, cantidad: 1 },  // Leche
      ]},
    },
    {
      nombre: 'Pack Limpieza Hogar',
      descripcion: 'Detergente + Lavandina + Papel Higiénico',
      precio: 5800.00,
      activo: true,
      fechaInicio: haceUnaSemana,
      fechaFin: enUnMes,
      items: { create: [
        { productoId: productos[18].id, cantidad: 1 }, // Detergente
        { productoId: productos[19].id, cantidad: 1 }, // Lavandina
        { productoId: productos[20].id, cantidad: 1 }, // Papel Higiénico
      ]},
    },
    {
      nombre: 'Merienda Dulce',
      descripcion: '2 paquetes de Oreo + Yogur Activia',
      precio: 3800.00,
      activo: true,
      fechaInicio: hoy,
      fechaFin: enUnMes,
      items: { create: [
        { productoId: productos[8].id, cantidad: 2 },  // Oreo
        { productoId: productos[5].id, cantidad: 1 },  // Yogur
      ]},
    },
    {
      nombre: 'Combo Snacks Fiesta',
      descripcion: 'Papas Lays + Bon o Bon + Cervezas x2',
      precio: 13500.00,
      activo: true,
      fechaInicio: hoy,
      fechaFin: enDosMeses,
      items: { create: [
        { productoId: productos[22].id, cantidad: 1 }, // Papas Lays
        { productoId: productos[21].id, cantidad: 1 }, // Bon o Bon
        { productoId: productos[3].id, cantidad: 2 },  // Cerveza
      ]},
    },
    {
      nombre: 'Canasta Básica',
      descripcion: 'Arroz + Fideos + Aceite + Azúcar',
      precio: 6500.00,
      activo: true,
      fechaInicio: haceUnaSemana,
      fechaFin: enDosMeses,
      items: { create: [
        { productoId: productos[10].id, cantidad: 1 }, // Arroz
        { productoId: productos[11].id, cantidad: 1 }, // Fideos
        { productoId: productos[12].id, cantidad: 1 }, // Aceite
        { productoId: productos[13].id, cantidad: 1 }, // Azúcar
      ]},
    },
    {
      nombre: 'Promo Mate Argentino',
      descripcion: 'Yerba Taragüí 1kg + Galletitas Criollitas x2',
      precio: 5800.00,
      activo: true,
      fechaInicio: hoy,
      fechaFin: enUnMes,
      items: { create: [
        { productoId: productos[14].id, cantidad: 1 }, // Yerba
        { productoId: productos[9].id, cantidad: 2 },  // Criollitas
      ]},
    },
  ];

  for (const promo of promocionesData) {
    await prisma.promocion.create({ data: promo });
  }
  console.log(`✅ ${promocionesData.length} promociones creadas`);

  console.log('\n🎉 ¡Datos de prueba cargados exitosamente!');
  console.log('   - 5 proveedores');
  console.log('   - 25 productos');
  console.log('   - 10 cuentas corrientes');
  console.log('   - 7 promociones (con productos asociados)');
}

main()
  .catch((e) => {
    console.error('❌ Error al cargar datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
