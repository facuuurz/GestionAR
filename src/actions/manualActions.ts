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
    id: "usuarios",
    title: "Usuarios",
    icon: "manage_accounts",
    description: "Conocé los roles, permisos y cómo gestionar las cuentas del personal.",
    content: `
      ### Módulo de Usuarios
      ¡Bienvenido al módulo de Usuarios de GestionAR! Para garantizar la seguridad de tu información comercial, el sistema utiliza un esquema de roles. Esto significa que cada persona que ingresa al sistema verá y podrá hacer únicamente lo que su nivel de acceso le permita.
      
      **1. Tipos de Roles y sus Capacidades**
      GestionAR divide a los usuarios en tres niveles jerárquicos:
      
      - **Empleado (Normal):** Es el nivel operativo básico para el trabajo diario (como cajeros o repositores).
        - Tienen acceso a las herramientas de venta y gestión diaria.
        - No están autorizados para realizar ni cargar copias de seguridad (Backups) del sistema.
      
      - **Administrador (Admin):** Es un nivel intermedio.
        - Pueden acceder al panel de estadísticas para analizar el rendimiento.
        - Tienen permisos para generar y restaurar backups del sistema.
        - Pueden ver la lista de empleados, pero de forma restringida: solo pueden visualizar a los empleados que están bajo su cargo directo.
      
      - **Super Administrador (Super Admin):** Es el nivel de máximo control.
        - Poseen todas las capacidades de un Administrador.
        - Son los únicos que pueden crear usuarios nuevos y eliminar cuentas del sistema.
        - Tienen acceso global para ver a todos los empleados registrados, sin restricciones.
      
      **2. Panel de Gestión de Usuarios**
      Si tienes los permisos necesarios (Admin o Super Admin), podrás administrar al personal de tu empresa:
      1. Haz clic en tu **Avatar** en la esquina superior derecha y selecciona la opción **Ver empleados**.
      2. Ingresarás a la pantalla **Gestión de Usuarios**, donde verás un listado completo de tu personal.
      3. **Para agregar a alguien:** Haz clic en el botón negro **+ Nuevo Usuario** en la esquina superior derecha para crearle su cuenta.
      4. **Para buscar y filtrar:** Puedes usar la barra de búsqueda o los botones rápidos para filtrar la tabla y ver solo a los Empleados, Admins o SuperAdmins.
      5. **Control individual:** En la tabla verás el nombre, usuario, rol, DNI y antigüedad de cada persona. En la última columna (Acciones), tendrás botones específicos para ver el detalle (ícono verde), editar su información (lápiz azul) o eliminar su cuenta (tacho rojo).
      
      **3. Mi Cuenta (Perfil Personal)**
      Cada usuario puede consultar su información personal y los detalles de sus credenciales:
      1. Abre el menú de tu **Avatar** y selecciona **Cuenta**.
      2. En la pantalla **Mi Cuenta**, verás un resumen de tu perfil, incluyendo un recuadro a la izquierda que te confirma qué nivel de acceso tienes (Ej. "Escudo de Super Admin") y tu fecha de ingreso.
      3. Encontrarás la sección **Información Personal**, donde figuran tus datos de registro como Nombre completo, Correo Electrónico, Nombre de Usuario, DNI y CUIT/CUIL.
      4. Más abajo, verás la **Información del Negocio** asociado a tu cuenta, como el Nombre del Local, la Dirección y el Teléfono.
    `
  },
  {
    id: "ventas",
    title: "Ventas",
    icon: "shopping_cart",
    description: "Aprende a registrar y administrar las ventas diarias.",
    content: `
      ### Módulo de Ventas
      ¡Bienvenido al módulo de Ventas de GestionAR! Esta es tu pantalla principal de facturación o "Punto de Venta". Desde aquí podrás registrar las compras diarias de tus clientes, aplicar combos promocionales, controlar el stock en tiempo real y asignar ventas a las cuentas corrientes.
      
      **1. Búsqueda y Selección de Productos**
      Para comenzar a armar el carrito de compras de un cliente:
      - **Manualmente:** Escribe el nombre, código o escanea el código de barras en la barra superior que dice "Buscar por nombre, código de barra...".
      - **Por Filtros:** Utiliza el botón **Filtrar** si necesitas buscar productos por categoría o características específicas.
      
      En la lista de resultados, verás información vital de cada producto antes de venderlo: su stock actual (en colores verde o rojo si está bajo), su precio y su fecha de vencimiento. Para sumar un producto al carrito, haz clic en el botón negro **+ Agregar** ubicado a la derecha del precio.
      
      **2. Aplicación de Promociones y Combos**
      Si el cliente desea llevar una oferta o un combo armado:
      1. Haz clic en el botón verde **Promociones** ubicado en la parte superior, junto a la barra de búsqueda.
      2. Se abrirá la ventana emergente Seleccionar Promoción, mostrando todas las ofertas que tienes activas actualmente (Ej. "2x1 en detergente", "Pack Merienda").
      3. Haz clic sobre la promoción deseada y el sistema añadirá automáticamente todos los productos del combo al carrito de compra con su precio especial ya calculado.
      
      **3. Asignación de Cliente (Opcional)**
      Por defecto, todas las ventas rápidas se registran a nombre de "Consumidor Final". Sin embargo, si necesitas asignar la venta a un cliente específico (muy útil para quienes tienen Cuenta Corriente):
      1. Dirígete a la sección superior derecha, en el recuadro CLIENTE.
      2. Utiliza la barra **Buscar Cliente...** para teclear el nombre o razón social de la persona que está realizando la compra.
      3. Selecciona al cliente de la lista desplegable. Ahora la venta quedará registrada a su nombre en el Historial.
      
      **4. Revisión del Carrito y Confirmación de Venta**
      Una vez que hayas agregado todos los productos y promociones:
      1. Revisa el Carrito de Compra en el panel derecho. Aquí verás el listado de todos los ítems agregados, pudiendo verificar que todo esté correcto.
      2. Controla los montos en la parte inferior, donde el sistema calculará automáticamente el Subtotal y el Total a cobrar.
      3. Una vez que el cliente haya realizado el pago, haz clic en el botón grande **✓ CONFIRMAR VENTA**.
      
      ¡Listo! El sistema descontará automáticamente el stock de los productos vendidos y guardará el registro en tu Historial de Ventas.
    `
  },
  {
    id: "historial-ventas",
    title: "Historial de Ventas",
    icon: "history",
    description: "Revisa, busca y audita todas las transacciones realizadas.",
    content: `
      ### Historial de Ventas
      ¡Bienvenido al módulo de Historial de Ventas de GestionAR! Esta es tu bitácora principal. Aquí quedan registradas, minuto a minuto, todas las operaciones finalizadas en el Punto de Venta. Podrás buscar comprobantes antiguos, auditar ventas del día y revisar el detalle de qué artículos se llevó cada cliente.
      
      **1. Búsqueda y Filtrado de Comprobantes**
      Si necesitas encontrar una venta específica (por ejemplo, ante el reclamo de un cliente o para un arqueo de caja), tienes dos herramientas muy potentes:
      - **Búsqueda Rápida:** Utiliza la barra superior ("Buscar por ID de venta o CUIT/CUIL...") si ya conoces el número de comprobante (Ej. #V-14) o el documento del cliente al que se le facturó. La tabla se actualizará al instante con los resultados.
      - **Filtrar Fecha:** Si necesitas ver todas las ventas de un día o mes en particular, haz clic en el botón negro **Filtrar Fecha** (ícono de calendario) situado arriba a la derecha.
        1. Se abrirá una ventana emergente donde podrás seleccionar el Año, Mes y Día exactos.
        2. Haz clic en **Aplicar** para ver el listado de ese período, o en el botón rojo **Restablecer** para volver a ver el historial completo.
      
      **2. Exploración del Listado General**
      En la tabla principal del Historial, tendrás una vista panorámica de tus ventas ordenadas cronológicamente (las más recientes arriba). Por cada fila podrás observar rápidamente:
      - La **Fecha** de la operación.
      - El número único de comprobante (**ID VENTA**).
      - A quién se le vendió (**CUIT/CUIL CUENTA** - Si el campo está vacío, significa que fue una venta genérica a Consumidor Final).
      - Qué cajero o usuario realizó la operación (**VENDEDOR**).
      - El **MONTO TOTAL** ingresado a la caja por esa venta.
      
      **3. Revisión del Detalle de Venta**
      Si necesitas saber exactamente qué artículos componen ese "Monto Total" de una operación, puedes ver el "ticket virtual":
      1. En el listado general, ubica la venta que deseas investigar.
      2. Dirígete a la última columna (ACCIÓN) y haz clic en el botón negro **Ver Detalles** (ícono de un ojo).
      3. Se abrirá una nueva pantalla llamada Detalle de venta.
      4. En la parte superior verás un resumen claro con el ID, la fecha, la Hora exacta de la transacción y el nombre del Sujeto / Cliente.
      5. Debajo, en el Desglose de Productos, encontrarás una tabla detallando:
         - Qué artículos se llevaron (con su código SKU).
         - La **CANTIDAD** de unidades.
         - El **PRECIO DE LISTA** unitario al momento de la venta.
         - Si se aplicó algún descuento (**PRECIO COBRADO**) y el **SUBTOTAL** de cada línea.
      6. Al finalizar tu revisión, simplemente haz clic en el botón blanco **← Volver** situado en la esquina inferior izquierda para regresar al listado principal.
    `
  },
  {
    id: "inventario",
    title: "Inventario / Productos",
    icon: "inventory_2",
    description: "Controla el stock, precios y categorías de tus productos.",
    content: `
      ### Módulo de Inventario
      Mantén el control total de tus existencias.
      
      **1. Carga de un Nuevo Producto (Agregar)**
      Para registrar un artículo que ingresa por primera vez a tu negocio, sigue estos pasos:
      1. Dirígete a la pantalla principal de Lista de Productos.
      2. En la esquina superior derecha, haz clic en el botón negro **+ Agregar Nuevo Producto**.
      3. Se abrirá el formulario de Información General. Completa los datos solicitados:
         - **Nombre del producto (*):** Ingresa una descripción clara (Ej. Coca Cola 2L).
         - **Código de barra (*):** Puedes escanear el producto con tu lector o ingresar los números manualmente.
         - **Tipo de Producto (*):** Selecciona la categoría del menú desplegable (ej. Bebidas, Almacén). Si la categoría no existe, puedes crearla rápidamente usando el botón + Agregar.
         - **Código de Proveedor (*):** Ingresa la referencia interna o el código que utiliza tu proveedor para este artículo.
         - **Fechas y Detalles:** Opcionalmente, puedes asignar una Fecha de Vencimiento (ideal para perecederos) y una Descripción breve (hasta 200 caracteres).
         - **¿Producto por Peso?:** Si el artículo se vende por kilos o gramos en lugar de unidades enteras, activa este interruptor.
         - **Stock y Precio (*):** Define el inventario inicial con el que cuentas y el precio de venta al público.
      4. Una vez completado, haz clic en el botón negro **Guardar Producto** en la parte inferior derecha. ¡Listo! El artículo ya está en tu catálogo.
      
      **2. Modificación de un Producto Existente (Editar)**
      Si necesitas corregir un precio por inflación, actualizar el stock físico o modificar cualquier detalle de un artículo ya cargado:
      1. En la Lista de Productos, utiliza la barra de búsqueda superior para encontrar rápidamente el artículo por su nombre, código o proveedor.
      2. Una vez que ubiques el producto en la tabla, dirígete a la última columna llamada Acciones.
      3. Haz clic en el botón negro **Editar** (identificado con el ícono de un lápiz).
      4. Accederás a la pantalla de Editar Producto, donde verás toda la información actual (por ejemplo, verás el stock original reflejado).
      5. Modifica los campos que necesites (Precio Unitario, Stock Total, etc.).
      6. Guarda los cambios para que la información se actualice inmediatamente en todo el sistema.
      
      **3. Eliminación de un Producto (Borrar)**
      Puedes eliminar productos de forma rápida y directa:
      1. En la Lista de Productos, busca el artículo que deseas remover.
      2. En la columna de Acciones, ubica el botón rojo **Borrar** (identificado con el ícono de un tacho de basura).
      3. Haz clic sobre él. *(Nota de seguridad: Recuerda que esta acción removerá el producto de tu lista activa, por lo que te sugerimos hacerlo solo con artículos que no volverás a comercializar).*
    `
  },
  {
    id: "cuentas-corrientes",
    title: "Cuentas Corrientes",
    icon: "account_balance_wallet",
    description: "Gestiona los saldos a favor o en contra de tus clientes de confianza.",
    content: `
      ### Cuentas Corrientes
      ¡Bienvenido al módulo de Cuentas Corrientes de GestionAR! En esta sección podrás administrar los saldos de tus clientes, llevar un registro claro de quiénes tienen deudas pendientes y registrar los pagos que ingresen para regularizar sus estados de cuenta.
      
      **1. Apertura de una Nueva Cuenta (Agregar)**
      Para registrar a un nuevo cliente y abrirle una cuenta corriente en el sistema, sigue estos pasos:
      1. Dirígete a la pantalla principal de Cuentas Corrientes.
      2. En la esquina superior derecha, haz clic en el botón negro **+ Agregar Nueva Cuenta**.
      3. Se abrirá el formulario de Información del Cliente. Completa los datos solicitados:
         - **Nombre o Razón Social (*):** Ingresa el nombre de la persona o la empresa (Ej. Juan Pérez o Pérez S.A.).
         - **CUIT / CUIL (*):** Documento fiscal del cliente.
         - **Datos de Contacto (*):** Completa el Correo Electrónico y Teléfono para poder comunicarte por temas de facturación o cobros.
         - **Ubicación:** Ingresa la Dirección Física y la Ciudad / Localidad.
         - **Saldo Inicial:** Si estás migrando desde otro sistema o anotador y el cliente ya tiene una deuda o un saldo a favor previo, puedes ingresarlo aquí (Ej: -1500 si debe dinero, o 1500 si tiene saldo a favor). Si es un cliente nuevo sin historial, déjalo en 0.
      4. Una vez completado, haz clic en el botón negro **Guardar Cuenta** en la parte inferior derecha.
      
      **2. Registro de Pagos (Saldar Cuenta)**
      Cuando un cliente con saldo deudor (en rojo) realiza un pago total o parcial, debes registrar ese ingreso para que su saldo se actualice:
      1. En la lista principal, busca al cliente utilizando la barra de búsqueda (puedes buscar por nombre, CUIT o ID).
      2. En la columna de Acciones, haz clic en el botón verde **Saldar** (ícono de billete con el símbolo $).
      3. Se abrirá una ventana emergente ("Saldar Cuenta") mostrando el nombre del cliente y su Saldo Actual (Ej. -$ 16.000,00).
      4. En el campo **Monto a ingresar**, escribe la cantidad de dinero que el cliente está entregando. *(Nota: Este monto se sumará matemáticamente al saldo actual. Por ejemplo, si debe -$16.000 e ingresas $10.000, su nuevo saldo será -$6.000).*
      5. Revisa que el monto sea correcto y haz clic en **Confirmar**.
      
      **3. Modificación de Datos del Cliente (Actualizar)**
      Si un cliente cambia de número de teléfono, dirección de correo o necesitas corregir un error de tipeo en su Razón Social:
      1. Ubica al cliente en la tabla principal.
      2. En la columna de Acciones, haz clic en el botón negro **Actualizar** (identificado con el ícono de un lápiz).
      3. Se abrirá la pantalla Editar Cliente.
      4. Modifica los campos de texto que necesites actualizar.
      5. Haz clic en el botón negro **Guardar Cambios** en la esquina inferior derecha.
      
      **4. Eliminación de una Cuenta Corriente (Borrar)**
      Si necesitas dar de baja a un cliente permanentemente del sistema, tienes dos formas de hacerlo:
      - **Desde la tabla principal:** Ubica al cliente y haz clic en el botón rojo **Borrar** (ícono de tacho de basura) en la columna de Acciones.
      - **Desde la pantalla de edición:** Si ya estás dentro de "Actualizar" viendo los detalles del cliente, puedes hacer clic en el botón rojo **Eliminar Cliente** ubicado en la esquina inferior izquierda.
      
      *(⚠️ Importante: Se recomienda saldar la cuenta a $0,00 antes de eliminar a un cliente para evitar inconsistencias en tus registros contables históricos).*
    `
  },
  {
    id: "promociones",
    title: "Promociones",
    icon: "local_offer",
    description: "Crea descuentos atractivos para potenciar tus ventas.",
    content: `
      ### Creador de Promociones
      ¡Bienvenido al módulo de Promociones de GestionAR! En esta sección podrás diseñar ofertas especiales, armar combos o "packs" de artículos, y programar descuentos por tiempo limitado para impulsar tus ventas.
      
      **1. Creación de una Nueva Promoción (Agregar)**
      Para armar una nueva oferta o combo, sigue estos pasos:
      1. Dirígete a la pantalla principal de Promociones.
      2. En la esquina superior derecha, haz clic en el botón negro **+ Nueva Promoción**.
      3. Se abrirá la pantalla de Información de la Promoción. Completa los siguientes datos:
         - **Nombre de la Promoción (*):** Un título corto y llamativo (Ej. "Pack Merienda" o "Descuento de Verano").
         - **Descripción (*):** Aclara qué incluye la promoción para que sea fácil de identificar.
         - **Productos Incluidos (*):** Utiliza el buscador para encontrar y seleccionar los artículos que formarán parte de este combo.
         - **Cantidades y Precios:** Una vez agregados los productos, podrás ajustar la cantidad (CANT) y el precio unitario promocional de cada uno. El Precio Promocional Final se calculará automáticamente sumando los subtotales.
         - **Vigencia:** Selecciona la Fecha de Inicio y la Fecha de Fin en los calendarios para definir cuánto tiempo estará disponible esta oferta.
      4. Para finalizar, haz clic en el botón negro **Guardar Promoción** en la esquina inferior derecha.
      
      **2. Edición y Gestión de Promociones (Actualizar / Activar)**
      Si necesitas extender la fecha de una oferta, cambiar los productos incluidos o pausar una promoción temporalmente:
      1. En el Listado de Promociones, busca la oferta que deseas modificar.
      2. En la columna de Acciones, haz clic en el botón negro **Actualizar** (ícono de lápiz).
      3. Dentro de la pantalla de Editar Promoción, podrás modificar cualquier detalle (agregar o quitar productos con el ícono rojo del tacho de basura, cambiar fechas, etc.).
      4. **Estado de la Promoción:** En la parte inferior, verás un interruptor (switch) verde. Puedes usarlo para activar o desactivar la promoción manualmente, sin importar las fechas que hayas configurado.
      5. Haz clic en **Guardar Cambios** para aplicar las modificaciones.
      
      *(💡 Acción Rápida: Si una promoción está inactiva y quieres volver a encenderla rápidamente, puedes hacer clic directamente en el botón negro **Activar** con el ícono de encendido desde la tabla principal).*
      
      **3. Eliminación de una Promoción (Borrar)**
      Si una oferta ya no se volverá a utilizar y quieres limpiar tu listado, puedes eliminarla:
      - **Desde la tabla principal:** Ubica la promoción y haz clic en el botón rojo **Borrar** (ícono de tacho de basura) en la columna de Acciones.
      - **Desde la pantalla de edición:** Si estás modificando la oferta, puedes usar el botón rojo **Eliminar Promoción** ubicado en la esquina inferior izquierda.
    `
  },
  {
    id: "proveedores",
    title: "Proveedores",
    icon: "local_shipping",
    description: "Administra los contactos y pedidos a tus distribuidores.",
    content: `
      ### Gestión de Proveedores
      ¡Bienvenido al módulo de Proveedores de GestionAR! En esta sección podrás crear y administrar tu agenda de contactos comerciales. Mantener esta información actualizada te permitirá tener siempre a mano los datos de las empresas y personas que abastecen tu negocio.
      
      **1. Carga de un Nuevo Proveedor (Agregar)**
      Para registrar a un nuevo abastecedor o marca en tu sistema, sigue estos pasos:
      1. Dirígete a la pantalla principal de Proveedores.
      2. En la esquina superior derecha, haz clic en el botón negro **+ Agregar Proveedor**.
      3. Se abrirá el formulario de Información General. Completa los siguientes datos:
         - **Código (*):** Asigna un código único para identificar a este proveedor internamente (Ej. PROV-2024 o las iniciales de la marca).
         - **Razón Social (*):** Ingresa el nombre oficial de la empresa o distribuidora.
         - **Contacto:** Escribe el nombre de la persona con la que te comunicas habitualmente (Ej. el nombre del preventista o vendedor).
         - **Teléfono (*):** Número de contacto directo.
         - **Correo Electrónico:** Dirección de email para enviar pedidos o consultas.
      4. Una vez completado el formulario, haz clic en el botón negro **Guardar Proveedor** ubicado en la esquina inferior derecha.
      
      **2. Modificación de Datos del Proveedor (Actualizar)**
      Si tu proveedor cambia de vendedor, actualiza su número de teléfono o cambia su razón social, puedes editar su perfil fácilmente:
      1. En el listado principal de Proveedores, utiliza la barra de búsqueda superior para encontrarlo rápidamente por su código, razón social o nombre de contacto.
      2. Una vez ubicado en la tabla, dirígete a la columna Acciones.
      3. Haz clic en el botón negro **Actualizar** (identificado con el ícono de un lápiz).
      4. Accederás a la pantalla Editar Proveedor, donde verás toda su información actual.
      5. Modifica los campos necesarios y, al terminar, haz clic en el botón negro **Guardar Cambios**.
      
      **3. Eliminación de un Proveedor (Borrar)**
      Si dejas de trabajar definitivamente con una marca o empresa, puedes eliminar su registro del sistema. Tienes dos formas rápidas de hacerlo:
      - **Desde la tabla principal:** Busca al proveedor en la lista y haz clic en el botón rojo con el ícono de tacho de basura en la columna de Acciones.
      - **Desde la pantalla de edición:** Si ya estás dentro de la ventana de "Actualizar" viendo los detalles del proveedor, puedes hacer clic directamente en el botón rojo **Eliminar Proveedor** situado en la esquina inferior izquierda.
    `
  },
  {
    id: "backup-restauracion",
    title: "Copias de Seguridad / Restauración",
    icon: "cloud_sync",
    description: "Protege o restaura tus datos en el sistema.",
    content: `
      ### Copias de Seguridad y Restauración
      ¡Bienvenido a la sección de Seguridad de GestionAR! Esta herramienta avanzada te permite resguardar toda la información de tu negocio (inventario, ventas, clientes) y restaurarla en caso de ser necesario. Es tu salvavidas digital.
      
      **1. ¿Cómo acceder a la herramienta?**
      Dirígete a la esquina superior derecha de tu pantalla y haz clic en tu Avatar de Usuario (el círculo de color con tu inicial).
      
      Se desplegará tu menú de perfil. Allí, haz clic en la opción **Recuperación (Backup)** identificada con el ícono de un reloj con una flecha.
      
      **2. Generar un Nuevo Backup (Crear Copia)**
      Si estás por hacer un cambio grande en el inventario o simplemente quieres resguardar tus datos al final del día, puedes forzar la creación de un respaldo manual:
      1. Al abrir la ventana de Recuperación de Backup, ubícate en la primera sección superior llamada "Generar nuevo backup".
      2. Haz clic en el botón verde **Crear Backup** (ícono de nube).
      3. El sistema recopilará toda tu información actual y generará un archivo seguro con toda la informacion.
      
      **3. Restaurar un Backup del Historial**
      GestionAR guarda copias de tu información (tanto las automáticas como las que creas manualmente). Para volver a uno de estos puntos de guardado:
      1. En la misma ventana, dirígete a la sección central: "Cargar el último backup (Automático)".
      2. Haz clic en el menú desplegable. Allí verás una lista de los archivos guardados, con la fecha y hora exacta de su creación (Ej. GestionAR_Backup_17-03-2026_18-20.json).
      3. Selecciona la fecha y hora a la cual deseas que el sistema regrese.
      4. Haz clic en el botón negro **Restaurar** para aplicar los datos de esa copia de seguridad.
      
      **4. Cargar un Archivo Manual (Subir archivo JSON)**
      Si acostumbras a descargar tus copias de seguridad y guardarlas en tu propia computadora o en un pendrive, puedes subirlas manualmente:
      1. Dirígete a la sección inferior de la ventana, llamada "Subir archivo JSON".
      2. Haz clic en el botón gris **Seleccionar archivo**.
      3. Se abrirá el explorador de archivos de tu computadora. Busca tu archivo de backup, selecciónalo y ábrelo.
      4. El sistema leerá el archivo y comenzará el proceso de restauración inmediatamente.
    `
  },
  {
    id: "estadisticas",
    title: "Estadísticas",
    icon: "monitoring",
    description: "Analiza el rendimiento y salud financiera de tu negocio.",
    content: `
      ### Estadísticas y Tablero de Control
      ¡Bienvenido al módulo de Estadísticas de GestionAR! Esta pantalla es el "tablero de control" de tu empresa. Aquí encontrarás una visión general y métricas clave sobre tu facturación, el movimiento de tu inventario y el estado de las deudas de tus clientes.
      
      **1. ¿Cómo acceder al Panel?**
      Para ingresar a esta pantalla en cualquier momento:
      1. Dirígete a la barra de navegación en la parte superior derecha de tu pantalla.
      2. Haz clic en el ícono de estadísticas (representado por un pequeño gráfico de líneas con una lupa), ubicado justo a la izquierda de la campana de notificaciones y de tu avatar de usuario.
      
      **2. Resumen de Facturación Bruta**
      En la parte superior del panel, verás tres indicadores principales que te muestran cuánto dinero ha ingresado a la caja:
      - **HOY:** Total facturado en la jornada actual.
      - **ESTA SEMANA:** Total facturado en los últimos 7 días.
      - **ESTE MES:** Total acumulado en el mes en curso (Ej. $61.909).
      Estos números te permiten saber de un vistazo si estás alcanzando tus objetivos de ventas.
      
      **3. Análisis de Rendimiento y Ventas**
      En la sección central, el sistema analiza el comportamiento de tus clientes y productos:
      - **Tráfico Pico:** Un gráfico de barras te muestra cuáles son los días de la semana con mayor movimiento (Lunes a Domingo). Además, debajo te indica tu Franja horaria pico (Ej. 1:00 - 2:00), ideal para saber en qué momento necesitas más personal en la caja o el salón.
      - **Más Vendidos (Por Volumen):** Un ranking de los productos que más "salen" o rotan por cantidad (unidades o kilos). (Ej. Mortadela: 5,401 kg).
      - **Estrellas (Por Facturación):** Un ranking de los artículos que, sin importar cuántos se vendan, son los que más dinero le dejan a tu negocio (Ej. Mortadela: $54.010).
      
      **4. Alertas Comerciales y Financieras**
      En la parte inferior, encontrarás dos recuadros diseñados para cuidar la salud económica de tu negocio:
      - **Ranking "Huesos" (Stock Estancado):** Te alerta sobre aquellos artículos que llevan más de 30 días sin registrar ni una sola venta. Es información clave para que decidas armar una Promoción y liberar ese espacio/dinero. Si todo se vende bien, verás el mensaje verde: "Excelente, no hay stock estancado".
      - **Riesgo Financiero (Top Deudores):** Si utilizas el módulo de Cuentas Corrientes, este recuadro te mostrará inmediatamente a los clientes que tienen las mayores deudas acumuladas (en rojo) junto a su número de teléfono, para que puedas gestionar la cobranza rápidamente (Ej. Facundo Hernandez: $16.000).
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
