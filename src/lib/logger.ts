import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  
  // 1. ACHICAMOS EL ERROR AL MÁXIMO
  serializers: {
    err: (err) => {
      // Prisma suele poner el error real en la última línea, así que la extraemos
      const lineas = err.message ? err.message.split('\n') : [];
      return lineas.length > 0 ? lineas[lineas.length - 1].trim() : 'Error de BD';
    },
    // Si tampoco te interesa ver todos los filtros de búsqueda en el log, descomentá la línea de abajo:
    // filters: () => undefined 
  },

  transport: {
    targets: [
      // 2. CONSOLA (Colorida para desarrollar)
      ...(isDev ? [{
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }] : []),
      
      // 3. ARCHIVO (Texto plano, corto, una sola línea)
      {
        target: 'pino-pretty', // Usamos pretty para que NO sea JSON
        options: {
          destination: './sistema.log', 
          colorize: false, // Sin colores para que el texto sea limpio
          translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
          ignore: 'pid,hostname', // Oculta datos innecesarios del servidor
          singleLine: true, // Obliga a que el error sea una sola línea de texto
        },
      },
    ],
  },
});