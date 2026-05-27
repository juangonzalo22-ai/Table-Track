# Proyecto: Table-Track (Single Page Application)

Solución frontend modular construida con React y Vite para la gestión integral de reservas gastronómicas.

###  Accesos Directos
* **Despliegue de Producción:** https://table-track-two.vercel.app
* **Endpoint Base de la API:** https://61a1466bd6c7db8aac05473b1.mockapi.io/reservas

###  Requerimientos Técnicos Implementados

1. **Módulo de Autenticación (`/login`)**
   * Control de acceso basado en el nombre del Host y el turno de trabajo.
   * Persistencia del estado de sesión mediante `LocalStorage`.
   * Protección de rutas privadas a través de Route Guards personalizados (`ProtectedRoute`).

2. **Módulo de Panel Central (`/tablero`)**
   * Consumo asíncrono del servicio MockAPI para operaciones de lectura y escritura.
   * CRUD completo de reservas con actualización inmediata del estado.
   * Modales interactivos de SweetAlert2 para la confirmación obligatoria previa a la eliminación de registros.

3. **Diseño de Interfaz (UX/UI)**
   * Maquetación responsiva moderna utilizando Tailwind CSS.
   * Control visual de estados asíncronos (*loaders* y *spinners* de carga).

###  Instalación y Despliegue Local

