import pino from 'pino';

// Determinamos si estamos en desarrollo o producción
const isDev = process.env.NODE_ENV !== 'production';

export const logger = pino({
  // Nivel mínimo a mostrar. En dev mostramos todo (debug), en prod solo info y errores.
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  
  // Configuración para que se vea lindo en la consola de desarrollo
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true, // Colores según el nivel (rojo error, verde info)
        translateTime: 'SYS:dd/mm/yyyy HH:MM:ss', // Formato de hora legible
        ignore: 'pid,hostname', // Oculta info irrelevante en local
      },
    },
  }),
});