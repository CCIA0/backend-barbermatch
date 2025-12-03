# Barbermatch Front-End


# Documentación Técnica - Backend BarberMatch

## Estructura General
El backend está desarrollado con NestJS y TypeORM, siguiendo una arquitectura modular. Cada módulo representa una funcionalidad principal del sistema.

## Arquitectura de Carpetas
La estructura del proyecto está basada en la arquitectura modular propuesta por NestJS, lo que facilita la separación de responsabilidades y la escalabilidad. El código fuente principal reside en el directorio `src`.

```
src/
├── admin/
├── appointments/
├── auth/
├── barbershops/
├── common/
├── dto/
├── entities/
├── hairstyles/
├── notifications/
├── users/
├── visagism/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

A continuación, se detalla el propósito de cada directorio y archivo principal:

- **Módulos de Dominio (`admin`, `appointments`, `auth`, etc.)**:
  - Cada uno de estos directorios representa un **módulo de NestJS** (`*.module.ts`) que agrupa una funcionalidad específica del negocio.
  - Dentro de cada módulo, se encuentran:
    - `*.controller.ts`: Define los endpoints de la API y maneja las solicitudes HTTP. Actúa como punto de entrada para las peticiones del cliente.
    - `*.service.ts`: Contiene la lógica de negocio principal. Es llamado por el controlador para procesar datos, interactuar con la base de datos y realizar las operaciones necesarias.
    - `*.spec.ts`: Archivos de pruebas unitarias para los controladores y servicios, asegurando que cada componente funcione como se espera.

- **`common/`**:
  - Directorio para componentes reutilizables que no pertenecen a un único módulo de dominio.
  - Ejemplos:
    - **Guards (`*.guard.ts`)**: Lógica para proteger rutas, como la validación de roles de usuario.
    - **Decorators (`*.decorator.ts`)**: Metadatos personalizados para enriquecer clases o funciones, como el decorador `@Roles`.
    - **Filters, Pipes, Interceptors**: Componentes para manejar excepciones, transformar datos o interceptar el flujo de solicitud/respuesta.

- **`dto/` (Data Transfer Objects)**:
  - Define clases que modelan la estructura de los datos que se transfieren entre el cliente y el servidor.
  - Se utilizan junto con `class-validator` y `class-transformer` para validar automáticamente los cuerpos de las solicitudes (`request body`) en los controladores, garantizando que los datos de entrada sean correctos.

- **`entities/`**:
  - Contiene las **entidades de TypeORM**. Cada clase en este directorio representa una tabla en la base de datos.
  - TypeORM utiliza estas entidades para realizar operaciones de base de datos (CRUD) y gestionar las relaciones entre tablas (ej. `@OneToMany`, `@ManyToOne`).

- **Archivos Raíz (`app.*.ts`, `main.ts`)**:
  - `main.ts`: Es el **punto de entrada** de la aplicación. Se encarga de crear la instancia de la aplicación NestJS, iniciar el servidor HTTP y aplicar configuraciones globales (como `ValidationPipe` para los DTOs).
  - `app.module.ts`: Es el **módulo raíz** de la aplicación. Importa todos los demás módulos de dominio y configura los proveedores globales.
  - `app.controller.ts` y `app.service.ts`: Componentes básicos de la aplicación, a menudo utilizados para rutas simples como un endpoint de estado (`/health`).

### Módulos a Implementar
- **AuthModule**: Registro y login de usuarios con JWT. Validación de datos con DTOs y protección de rutas por roles.
- **UsersModule**: Gestión de usuarios y perfiles. Actualización de datos personales y preferencias de estilo.
- **BarbershopsModule**: Registro y gestión de barberías y barberos.
- **AppointmentsModule**: Agendamiento, actualización y cancelación de citas.
- **VisagismModule**: Análisis facial simulado (listo para integración con ML Kit/MediaPipe).
- **HairstylesModule**: Catálogo de estilos de corte, con filtros por forma de rostro.
- **NotificationsModule**: Servicio para enviar notificaciones y recordatorios (listo para integración con OneSignal).
- **AdminModule**: Dashboard administrativo con estadísticas básicas.
- **Common**: Guard y decorador para roles.
- **DTOs**: Validación de datos de entrada en endpoints principales.
- **Entities**: Modelos de base de datos para usuarios, perfiles, citas, barberías, barberos, estilos y resultados de análisis facial.

## Principales Endpoints
- `POST /auth/register`: Registro de usuario (valida con DTO).
- `POST /auth/login`: Login y generación de JWT.
- `GET /users/me/:id`: Obtener datos del usuario autenticado.
- `PUT /users/profile/:id`: Actualizar perfil (valida con DTO).
- `POST /barbershops`: Registrar barbería.
- `POST /barbershops/:id/barbers`: Agregar barbero a barbería.
- `POST /appointments`: Crear cita (valida y transforma fecha).
- `PUT /appointments/:id/cancel`: Cancelar cita.
- `POST /visagism/analyze`: Analizar imagen facial (simulado).
- `POST /hairstyles`: Crear estilo de corte.
- `GET /hairstyles/filter?faceShape=oval`: Filtrar estilos por forma de rostro.
- `GET /admin/dashboard`: Estadísticas administrativas.

## Seguridad y Validación
- Autenticación con JWT.
- Validación de datos con DTOs y `class-validator`.
- Protección de rutas por roles con guard y decorador personalizado.

## Integraciones Externas
- Listo para integrar ML Kit/MediaPipe (visagismo) y OneSignal (notificaciones).

## Siguientes pasos recomendados
- Implementar integración real con servicios externos.
- Mejorar la gestión de errores y respuestas.
- Agregar tests automatizados.
- Documentar la API con Swagger.

---


Interfaz de usuario para Barbermatch, una aplicación web moderna para la gestión y reserva de citas en barberías.

## 🚀 Sobre el Proyecto

Este proyecto constituye el front-end de Barbermatch, desarrollado con Next.js y TypeScript. Proporciona una experiencia de usuario fluida y reactiva para clientes y administradores, abarcando desde el registro de usuarios y la reserva de citas hasta paneles de administración avanzados.

## ✨ Características Principales

- **Autenticación de Usuarios:** Sistema completo de registro e inicio de sesión.
- **Reserva de Citas:** Flujo intuitivo para que los clientes seleccionen servicios, fechas y horas.
- **Panel de Usuario:** Área personal para que los usuarios vean su historial de citas y gestionen su perfil.
- **Panel de Administración:** Vistas dedicadas para que los administradores gestionen usuarios y citas de la barbería.
- **Visagismo (Próximamente):** Funcionalidad para recomendar estilos de corte basados en la forma del rostro del usuario.
- **Diseño Responsivo:** Interfaz completamente adaptable a dispositivos móviles y de escritorio.

## 🛠️ Tecnologías Utilizadas

- **Framework:** [Next.js](https://nextjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/UI](https://ui.shadcn.com/) sobre [Radix UI](https://www.radix-ui.com/)
- **Gestión de Formularios:** [React Hook Form](https://react-hook-form.com/) con [Zod](https://zod.dev/) para validación.
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Gestor de Paquetes:** pnpm

## 📂 Estructura de Carpetas

El proyecto utiliza el `App Router` de Next.js, organizando la aplicación de manera lógica y basada en rutas.

```
barbermatch_front/
├── app/                      # Directorio principal de rutas y lógica de la aplicación
│   ├── admin/                # Rutas y páginas del panel de administración
│   ├── booking/              # Flujo de reserva de citas
│   ├── dashboard/            # Panel de control del usuario
│   ├── login/                # Página de inicio de sesión
│   ├── register/             # Página de registro
│   ├── styles/               # Páginas relacionadas con estilos de corte
│   ├── visagismo/            # Página para la funcionalidad de visagismo
│   ├── layout.tsx            # Layout principal de la aplicación
│   └── page.tsx              # Página de inicio (landing page)
├── components/               # Componentes React reutilizables
│   ├── ui/                   # Componentes de Shadcn/UI
│   └── visagismo-widget.tsx  # Componente específico para visagismo
├── hooks/                    # Hooks personalizados de React
├── lib/                      # Funciones de utilidad (ej. utils.ts)
├── public/                   # Archivos estáticos (imágenes, logos)
├── styles/                   # Estilos globales (ej. globals.css)
├── next.config.mjs           # Archivo de configuración de Next.js
├── package.json              # Dependencias y scripts del proyecto
└── tsconfig.json             # Configuración de TypeScript
```

## 🏁 Cómo Empezar

Sigue estos pasos para tener una copia del proyecto corriendo localmente.

### Prerrequisitos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior) y [pnpm](https://pnpm.io/).

### Instalación

1. Clona el repositorio:
   ```sh
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Navega al directorio del proyecto:
   ```sh
   cd barbermatch_front
   ```
3. Instala las dependencias:
   ```sh
   pnpm install
   ```

### Ejecución

Para iniciar el servidor de desarrollo:

```sh
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 📜 Scripts Disponibles

En el archivo `package.json`, encontrarás los siguientes scripts:

- `pnpm dev`: Inicia la aplicación en modo de desarrollo.
- `pnpm build`: Compila la aplicación para producción.
- `pnpm start`: Inicia un servidor de producción.
- `pnpm lint`: Ejecuta el linter de Next.js para verificar la calidad del código.
