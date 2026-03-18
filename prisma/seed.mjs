import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const randItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

async function main() {
  console.log('🧹 Limpiando base de datos (Esto puede tomar un momento)...');
  await prisma.detalleVenta.deleteMany({});
  await prisma.venta.deleteMany({});
  await prisma.promocionProducto.deleteMany({});
  await prisma.promocion.deleteMany({});
  await prisma.movimiento.deleteMany({});
  await prisma.cuenta_corriente.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.proveedor.deleteMany({});
  await prisma.passwordHistory.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      username: { notIn: ['superadmin'] } 
    }
  });

  console.log('🌱 Cargando datos de prueba masivos...\n');

  // ========== USUARIOS ==========
  const superadminHash = await bcrypt.hash('Gestionar2026$', 10);
  const empleadoHash = await bcrypt.hash('Empleado2026$', 10);

  const superadmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'superadmin@gestionar.com',
      name: 'Super Administrador',
      passwordHash: superadminHash,
      role: 'SUPERADMIN',
    },
  });

  const users = [];
  for(let i=1; i<=10; i++) {
    const isEmpleado = i <= 8; 
    const emp = await prisma.user.create({
      data: {
        username: `usuario${i}`,
        email: `usuario${i}@gestionar.com`,
        name: `Usuario de Prueba ${i}`,
        passwordHash: empleadoHash,
        role: isEmpleado ? 'EMPLEADO' : 'ADMIN',
        dni: `1000000${i}`,
      }
    });
    users.push(emp);
  }
  console.log(`✅ ${users.length} usuarios creados`);

  // ========== PROVEEDORES ==========
  const proveedores = [];
  for(let i=1; i<=20; i++) {
    const prov = await prisma.proveedor.create({
      data: { 
        codigo: `PROV-${1000 + i}`, 
        razonSocial: `Proveedor Distribuidor ${i} SA`,
        contacto: `Contacto ${i}`,
        telefono: `011-4000-${1000+i}`,
        email: `ventas${i}@proveedor.com`
      }
    });
    proveedores.push(prov);
  }
  console.log(`✅ ${proveedores.length} proveedores creados`);

  // ========== PRODUCTOS ==========
  const categorias = ['Bebidas', 'Lácteos', 'Limpieza', 'Almacén', 'Fiambrería', 'Panadería', 'Snacks', 'Golosinas'];
  const productos = [];
  for(let i=1; i<=100; i++) {
    const esPorPeso = Math.random() > 0.8;
    const cat = randItem(categorias);
    const prod = await prisma.producto.create({
      data: {
        nombre: `Producto Ficticio ${i} - ${cat}`,
        codigoBarra: `779000${10000 + i}`,
        descripcion: `Descripción generada para el producto ${i}`,
        tipo: cat,
        proveedor: randItem(proveedores).codigo,
        stock: randInt(10, 200),
        precio: randFloat(500, 15000),
        esPorPeso: esPorPeso,
      }
    });
    productos.push(prod);
  }
  console.log(`✅ ${productos.length} productos creados`);

  // ========== CUENTAS CORRIENTES ==========
  const cuentas = [];
  for(let i=1; i<=30; i++) {
    const esDeudor = Math.random() > 0.7;
    const c = await prisma.cuenta_corriente.create({
      data: {
        nombre: `Cliente Frecuente ${i}`,
        cuit: `20-3000${1000 + i}-7`,
        telefono: `011-5000-${1000 + i}`,
        email: `cliente${i}@mail.com`,
        direccion: `Calle Falsa ${100 + i}`,
        ciudad: randItem(['CABA', 'Rosario', 'Córdoba', 'Mendoza']),
        saldo: esDeudor ? randFloat(-50000, -1000) : randFloat(0, 20000),
        estado: esDeudor ? 'Deudor' : 'Al Día',
        saldoNegativoDesde: esDeudor ? randDate(new Date('2025-01-01'), new Date()) : null
      }
    });
    cuentas.push(c);
  }
  console.log(`✅ ${cuentas.length} cuentas corrientes creadas`);

  // ========== MOVIMIENTOS ==========
  const movimientos = [];
  for(let i=1; i<=100; i++) {
    const c = randItem(cuentas);
    const isCredito = Math.random() > 0.5;
    const m = await prisma.movimiento.create({
      data: {
        fecha: randDate(new Date('2025-10-01'), new Date()),
        descripcion: isCredito ? 'Pago en efectivo' : 'Compra a crédito',
        monto: randFloat(1000, 15000),
        tipo: isCredito ? 'CREDITO' : 'DEBITO',
        cuentaCorrienteId: c.id
      }
    });
    movimientos.push(m);
  }
  console.log(`✅ ${movimientos.length} movimientos de cuenta creados`);

  // ========== VENTAS ==========
  const ventas = [];
  for(let i=1; i<=200; i++) {
    // 30% asociadas a cuenta corriente, 70% sin cuenta
    const c = Math.random() > 0.7 ? randItem(cuentas) : null;
    const u = randItem(users);
    
    const numItems = randInt(1, 5);
    const ventaItems = [];
    let totalVenta = 0;
    
    for(let j=0; j<numItems; j++) {
      const p = randItem(productos);
      const cant = p.esPorPeso ? randFloat(0.1, 3.5) : randInt(1, 5);
      const sub = cant * Number(p.precio);
      totalVenta += sub;
      
      ventaItems.push({
        productoId: p.id,
        cantidad: cant,
        precioUnit: p.precio,
        subtotal: sub
      });
    }

    const v = await prisma.venta.create({
      data: {
        fecha: randDate(new Date('2025-10-01'), new Date()),
        total: totalVenta,
        cuentaCorrienteId: c ? c.id : null,
        userId: u.id,
        detalles: {
          create: ventaItems
        }
      }
    });
    ventas.push(v);
  }
  console.log(`✅ ${ventas.length} ventas creadas (con sus respectivos detalles)`);

  // ========== PROMOCIONES ==========
  const promociones = [];
  for(let i=1; i<=20; i++) {
    const hoy = new Date();
    const isActiva = Math.random() > 0.3;
    const inicio = isActiva ? randDate(new Date('2025-12-01'), hoy) : randDate(new Date('2026-06-01'), new Date('2026-12-01'));
    const fin = new Date(inicio.getTime() + randInt(7, 30) * 24 * 60 * 60 * 1000); 

    const numItems = randInt(1, 3);
    const promoItems = [];
    let basePrice = 0;
    
    const shuffledProds = [...productos].sort(() => 0.5 - Math.random());
    const selectedProds = shuffledProds.slice(0, numItems);
    
    selectedProds.forEach(p => {
      const c = randInt(1, 4);
      basePrice += Number(p.precio) * c;
      promoItems.push({
        productoId: p.id,
        cantidad: c
      });
    });

    const precioPromo = basePrice * randFloat(0.6, 0.9); 

    const prom = await prisma.promocion.create({
      data: {
        nombre: `Promoción Semanal ${i}`,
        descripcion: `Descripción automática para la promoción ${i}`,
        precio: precioPromo,
        activo: isActiva,
        fechaInicio: inicio,
        fechaFin: fin,
        items: {
          create: promoItems
        }
      }
    });
    promociones.push(prom);
  }
  console.log(`✅ ${promociones.length} promociones creadas`);

  console.log('\n🎉 ¡Miles de datos ficticios generados y cargados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error al cargar datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
