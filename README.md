Contexto del Proyecto BarberMatch - Backend (NestJS)
🎯 Descripción General del Sistema
BarberMatch es una plataforma web responsiva que conecta usuarios con barberías. El backend, construido con NestJS, es una API REST que gestiona la lógica de negocio, la base de datos PostgreSQL, la integración con servicios de IA para visagismo y el sistema de notificaciones.

🏗️ Arquitectura Técnica del Backend
Framework: NestJS

Lenguaje: TypeScript

Base de Datos: PostgreSQL con TypeORM

Autenticación: JWT (JSON Web Tokens)

Servicios Externos:

ML Kit & MediaPipe: Para análisis facial (servicio de visagismo).

OneSignal: API para enviar notificaciones push.

📦 Módulos de NestJS a Implementar
El sistema debe estar estructurado en los siguientes módulos:

1. Módulo AuthModule
Propósito: Gestionar todo el proceso de autenticación y autorización.

Servicios: AuthService, JwtStrategy, LocalStrategy.

Controladores: AuthController (endpoints: /auth/login, /auth/register).

Entidades: User, Profile.

Características:

Registro de usuarios (clientes y barberos).

Login (generación de JWT).

Protección de rutas con Guards (@UseGuards(JwtAuthGuard)).

Cifrado de contraseñas con bcrypt.

2. Módulo UsersModule
Propósito: Gestionar los datos y perfiles de los usuarios.

Servicios: UsersService.

Controladores: UsersController (endpoints: /users/me, /users/:id).

Entidades: User, UserProfile.

Características:

CRUD de usuarios.

Gestión de perfiles (actualizar preferencias de estilo, datos personales).

3. Módulo BarbershopsModule
Propósito: Gestionar la información de las barberías.

Servicios: BarbershopsService.

Controladores: BarbershopsController.

Entidades: Barbershop, Barber.

Características:

Registrar barberías y sus barberos.

Gestionar horarios de atención.

4. Módulo AppointmentsModule (Citas)
Propósito: Gestionar el agendamiento y la lógica de citas.

Servicios: AppointmentsService.

Controladores: AppointmentsController (endpoints: /appointments).

Entidades: Appointment.

Características:

Crear, leer, actualizar y cancelar citas.

Verificar disponibilidad en tiempo real.

Integración con el calendario de la barbería.

5. Módulo VisagismModule (Visagismo Digital)
Propósito: Procesar imágenes y generar recomendaciones de cortes.

Servicios: VisagismService, ImageAnalysisService (cliente para ML Kit/MediaPipe).

Controladores: VisagismController (endpoint: /visagism/analyze).

Entidades: FaceAnalysisResult, HairstyleRecommendation.

Características:

Endpoint para subir una imagen (POST /visagism/analyze).

Llamar a servicios de IA (ML Kit para detección básica, MediaPipe para análisis avanzado).

Aplicar reglas de negocio para las recomendaciones basadas en la forma del rostro.

Devolver una lista de estilos recomendados del catálogo.

6. Módulo HairstylesModule (Catálogo de Estilos)
Propósito: Gestionar el catálogo de cortes de cabello.

Servicios: HairstylesService.

Controladores: HairstylesController (endpoints: /hairstyles).

Entidades: Hairstyle.

Características:

CRUD de estilos de corte.

Filtros por forma de rostro, popularidad, tipo de cabello, etc.

Los estilos tienen atributos como faceShape (para qué forma facial es ideal).

7. Módulo NotificationsModule
Propósito: Gestionar el envío de notificaciones push.

Servicios: NotificationsService (cliente para la API de OneSignal).

Características:

Enviar recordatorios de citas.

Enviar mensajes promocionales.

Segmentación de usuarios.

8. Módulo AdminModule (Backoffice)
Propósito: Proveer endpoints para la gestión administrativa.

Controladores: AdminController (endpoints: /admin/...).

Características:

Dashboard con estadísticas.

Gestión de usuarios, citas y barberías.

Protegido con un guard de rol (@Roles('admin')).

🔐 Atributos de Calidad (Énfasis Técnico)
Seguridad: Todas las comunicaciones deben usar TLS/HTTPS. Validar y sanitizar todos los inputs. Usar parámetros preparados en queries SQL (TypeORM ya lo hace).

Rendimiento: El análisis de visagismo debe ser optimizado (ej., usar colas para tareas pesadas). El tiempo de respuesta para la recomendación debe ser <2s.

Escalabilidad: La arquitectura por módulos de NestJS permite escalar servicios de forma independiente. La base de datos debe estar normalizada para soportar crecimiento.

Mantenibilidad: Código bien estructurado, tipado y documentado. Uso de DTOs para la validación de datos en entradas y salidas de la API.

🗃️ Esquema de Base de Datos (Entidades Principales)
typescript
// User Entity
class User {
  id: number;
  email: string;
  password: string;
  role: 'client' | 'barber' | 'admin';
  profile: UserProfile;
  appointments: Appointment[];
}

// Appointment Entity
class Appointment {
  id: number;
  date: DateTime;
  status: 'pending' | 'confirmed' | 'cancelled';
  user: User;
  barber: Barber;
  barbershop: Barbershop;
}

// Hairstyle Entity (Catálogo)
class Hairstyle {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  recommendedFaceShapes: string[]; // ['oval', 'square', ...]
}
🔄 Flujos Clave a Implementar
Flujo de Agendamiento: Usuario autenticado → Verifica disponibilidad → Crea cita → Notificación a usuario y barbero.

Flujo de Visagismo: Usuario sube imagen → Backend la procesa con servicios de IA → Aplica reglas de recomendación → Devuelve estilos del catálogo filtrados.

Flujo de Notificaciones: Un servicio escucha eventos (ej: AppointmentCreatedEvent) y llama a NotificationsService para enviar el mensaje via OneSignal.

---

## 🛠️ Pasos Iniciales para el Desarrollo Backend

1. **Inicializar Proyecto NestJS**
   ```bash
   nest new BarberMatch-backend
   ```

2. **Instalar dependencias principales**
   ```bash
   npm install @nestjs/typeorm typeorm pg @nestjs/jwt passport-jwt bcrypt @nestjs/passport passport
   ```

3. **Estructura recomendada de carpetas**
   ```
   src/
     auth/
     users/
     barbershops/
     appointments/
     visagism/
     hairstyles/
     notifications/
     admin/
     common/
     entities/
     dto/
   ```

4. **Generar módulos con CLI**
   ```bash
   nest generate module auth
   nest generate module users
   nest generate module barbershops
   nest generate module appointments
   nest generate module visagism
   nest generate module hairstyles
   nest generate module notifications
   nest generate module admin
   ```

5. **Crear entidades en `src/entities/`**
   - User
   - UserProfile
   - Appointment
   - Barbershop
   - Barber
   - Hairstyle

6. **Implementar servicios y controladores según el contexto**

7. **Configurar TypeORM en `app.module.ts`**
   - Conexión a PostgreSQL
   - Registrar entidades

8. **Configurar autenticación JWT y guards de roles**

9. **Integrar servicios externos (ML Kit, MediaPipe, OneSignal) como providers**

10. **Usar DTOs para validación y documentación de la API**

11. **Testing**
    ```bash
    # Ejecutar todos los tests
    npm run test

    # Ejecutar tests con coverage
    npm run test:cov

    # Ejecutar tests e2e
    npm run test:e2e
    ```

    El proyecto mantiene un alto estándar de cobertura de pruebas:
    - Tests unitarios para cada módulo
    - Coverage objetivo: 100%
    - Mínimo 100 tests unitarios
    - Tests e2e para flujos críticos

    Estructura de tests:
    ```
    src/
      auth/
        *.spec.ts       # Tests unitarios de auth
      users/
        *.spec.ts       # Tests unitarios de users
      dto/
        *.spec.ts       # Tests de validación de DTOs
      visagism/
        *.spec.ts       # Tests de análisis facial
    test/
      *.e2e-spec.ts    # Tests end-to-end
    ```

    Cada módulo incluye tests para:
    - Controllers
    - Services
    - Guards
    - DTOs
    - Entities
    - Pipes
    - Filters

---

> Sigue estos pasos para estructurar el backend y consulta este archivo como referencia para la lógica de negocio y endpoints.