
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    
    const cron = require('node-cron');
    const { generarBackupLocal } = await import('./actions/backup');
    const { checkProductExpirations } = await import('./actions/inventoryMaint');

    // "0 16 * * 5" significa: Minuto 22, Hora 15, Cualquier día, Cualquier mes, Día 5 (Viernes)
    cron.schedule('0 17 * * 5', async () => {
      console.log("⏳ Ejecutando tarea programada: Backup de BD...");
      await generarBackupLocal();
    }, {
      scheduled: true,
      timezone: "America/Argentina/Buenos_Aires" 
    });

    cron.schedule('0 8 * * *', async () => {
      console.log("⏳ Ejecutando revisión diaria de fechas de vencimiento...");
      await checkProductExpirations();
    }, {
      scheduled: true,
      timezone: "America/Argentina/Buenos_Aires" 
    });

    console.log("⏰ Reloj de Backups iniciado. Programado para los Viernes a las 17:00 hs.");
    console.log("⏰ Chequeo de vencimiento de productos programado (Diario a las 08:00 hs).");
  }
}