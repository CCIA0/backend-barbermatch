# Documentación Técnica - Backend BarberMatch

## 🎯 Descripción General
El backend de BarberMatch está desarrollado con **NestJS** y **TypeORM**, implementando una arquitectura modular RESTful que conecta usuarios con barberías. El sistema incluye autenticación JWT, integración con servicios de IA para análisis facial (visagismo), notificaciones y un pipeline CI/CD completo con Azure DevOps.

## 🏗️ Stack Tecnológico
- **Framework**: NestJS (Node.js 18.x)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL 15
- **ORM**: TypeORM
- **Autenticación**: JWT (Passport.js)
- **Testing**: Jest (100% coverage target, >100 tests unitarios)
- **CI/CD**: Azure DevOps Pipelines
- **Análisis de Código**: SonarCloud
- **Performance Testing**: Apache JMeter 5.6.3
- **Deployment**: Azure App Service

## 📦 Arquitectura de Carpetas
La estructura del proyecto sigue la arquitectura modular de NestJS, con separación clara de responsabilidades:

```
src/
├── admin/              # Módulo administrativo y dashboard
├── appointments/       # Gestión de citas y agendamiento
├── auth/              # Autenticación y autorización (JWT)
├── barbershops/       # Gestión de barberías y barberos
├── common/            # Componentes compartidos (guards, decorators, filters)
├── dto/               # Data Transfer Objects para validación
├── entities/          # Entidades TypeORM (modelos de BD)
├── hairstyles/        # Catálogo de estilos de corte
├── notifications/     # Sistema de notificaciones (OneSignal ready)
├── types/             # Definiciones de tipos TypeScript
├── users/             # Gestión de usuarios y perfiles
├── visagism/          # Análisis facial y recomendaciones
├── app.controller.ts  # Controlador raíz
├── app.module.ts      # Módulo principal
├── app.service.ts     # Servicio raíz
└── main.ts           # Punto de entrada de la aplicación

test/                  # Tests end-to-end
coverage/             # Reportes de cobertura de tests
```

### Descripción de Componentes por Módulo

**Estructura típica de cada módulo**:
- `*.controller.ts`: Endpoints HTTP y manejo de requests
- `*.service.ts`: Lógica de negocio y operaciones de BD
- `*.module.ts`: Configuración del módulo NestJS
- `*.spec.ts`: Tests unitarios (coverage 100%)

**Directorio `common/`**:
- **Guards**: `roles.guard.ts` - Protección de rutas por roles
- **Decorators**: `roles.decorator.ts` - Metadatos personalizados
- **Filters**: Manejo global de excepciones
- **Pipes**: Transformación y validación de datos

**Directorio `dto/`**:
- Validación automática con `class-validator`
- Transformación con `class-transformer`
- Documentación de API
- Ejemplos: `CreateUserDto`, `UpdateProfileDto`, `CreateAppointmentDto`

**Directorio `entities/`**:
- Modelos TypeORM con decoradores
- Relaciones entre tablas (`@OneToMany`, `@ManyToOne`)
- Migraciones de base de datos
- Ejemplos: `User`, `Appointment`, `Barbershop`, `Hairstyle`

## 🔗 Módulos Implementados

### 1. AuthModule
**Propósito**: Autenticación y autorización con JWT

**Componentes**:
- `AuthService`: Lógica de login y registro
- `JwtStrategy`: Estrategia de validación JWT
- `LocalStrategy`: Estrategia de login local
- `AuthController`: Endpoints de autenticación

**Endpoints principales**:
- `POST /auth/register`: Registro de usuarios (valida con DTO)
- `POST /auth/login`: Login y generación de token JWT

**Características**:
- Cifrado de contraseñas con bcrypt
- Tokens JWT con expiración configurable
- Protección de rutas con `@UseGuards(JwtAuthGuard)`
- Soporte para roles (client, barber, admin)

### 2. UsersModule
**Propósito**: Gestión de usuarios y perfiles

**Entidades**: `User`, `UserProfile`

**Endpoints principales**:
- `GET /users/me/:id`: Obtener perfil del usuario autenticado
- `PUT /users/profile/:id`: Actualizar datos personales y preferencias

**Características**:
- CRUD completo de usuarios
- Gestión de preferencias de estilo
- Validación de datos con DTOs
- Relación one-to-one con perfil

### 3. BarbershopsModule
**Propósito**: Gestión de barberías y barberos

**Entidades**: `Barbershop`, `Barber`

**Endpoints principales**:
- `POST /barbershops`: Registrar nueva barbería
- `POST /barbershops/:id/barbers`: Agregar barbero a barbería
- `GET /barbershops`: Listar barberías disponibles

**Características**:
- Gestión de horarios de atención
- Relación one-to-many con barberos
- Geolocalización (ready)

### 4. AppointmentsModule
**Propósito**: Agendamiento y gestión de citas

**Entidad**: `Appointment`

**Endpoints principales**:
- `POST /appointments`: Crear nueva cita
- `PUT /appointments/:id/cancel`: Cancelar cita
- `GET /appointments/user/:userId`: Citas del usuario
- `GET /appointments/barber/:barberId`: Agenda del barbero

**Características**:
- Validación de disponibilidad en tiempo real
- Estados: pending, confirmed, cancelled
- Transformación y validación de fechas
- Integración con NotificationsModule

### 5. VisagismModule
**Propósito**: Análisis facial y recomendaciones de estilos

**Entidad**: `FaceAnalysisResult`

**Endpoints principales**:
- `POST /visagism/analyze`: Analizar imagen facial (simulado)

**Características**:
- Simulación de análisis facial
- Listo para integración con ML Kit/MediaPipe
- Detección de forma de rostro (oval, square, round, etc.)
- Generación de recomendaciones basadas en reglas
- Respuesta con estilos filtrados del catálogo

### 6. HairstylesModule
**Propósito**: Catálogo de estilos de corte

**Entidad**: `Hairstyle`

**Endpoints principales**:
- `POST /hairstyles`: Crear nuevo estilo
- `GET /hairstyles/filter?faceShape=oval`: Filtrar por forma de rostro
- `GET /hairstyles`: Listar catálogo completo

**Características**:
- CRUD de estilos
- Filtros por forma facial, tipo de cabello, popularidad
- Atributos: name, description, imageUrl, recommendedFaceShapes

### 7. NotificationsModule
**Propósito**: Sistema de notificaciones push

**Componente**: `NotificationsService`

**Características**:
- Servicio exportable para uso en otros módulos
- Listo para integración con OneSignal API
- Envío de recordatorios de citas
- Mensajes promocionales
- Segmentación de usuarios

### 8. AdminModule
**Propósito**: Dashboard administrativo

**Endpoints principales**:
- `GET /admin/dashboard`: Estadísticas generales

**Características**:
- Protegido con `@Roles('admin')` guard
- Estadísticas de usuarios, citas y barberías
- Panel de control centralizado

## 🔐 Seguridad y Validación

### Autenticación
- JWT con estrategia Passport
- Tokens en header `Authorization: Bearer <token>`
- Expiración configurable
- Refresh tokens (ready)

### Autorización
- Guard personalizado: `RolesGuard`
- Decorador: `@Roles('admin', 'barber', 'client')`
- Validación de permisos por endpoint

### Validación de Datos
- DTOs con `class-validator`
- Pipes de validación automática
- Transformación de tipos con `class-transformer`
- Sanitización de inputs

### Base de Datos
- Queries preparadas automáticamente por TypeORM
- Prevención de SQL Injection
- Validación de relaciones

## 🚀 CI/CD Pipeline (Azure DevOps)

### Stages Implementados

#### 1. Build and Test
- Instalación de Node.js 18.x
- `npm ci` (instalación reproducible)
- `npm run lint` (ESLint)
- `npm run test:cov` (tests con coverage)
- `npm run build` (compilación TypeScript)
- Publicación de artefactos (dist/*.zip)

#### 2. SonarCloud Analysis
- Análisis de calidad de código
- Project Key: `iduertom_BarberMatch-frontend` (actualizar)
- Organization: `iduertom`
- Service Connection: `SonarCloud`
- Métricas: bugs, vulnerabilities, code smells, coverage

#### 3. Security Scan
- `npm audit --audit-level=moderate`
- Detección de dependencias vulnerables
- `npx depcheck` (dependencias no utilizadas)
- Continúa en error (non-blocking)

#### 4. Deploy to Azure App Service
- Solo en rama `main`
- Descarga de artefactos
- Despliegue a Azure Web App (Linux)
- Runtime: Node.js 18 LTS
- Comando: `npm run start:prod`
- Service Connection: `AzureServiceConnection`
- App Service: `barbermatch-backend`

#### 5. JMeter Performance Testing
- Apache JMeter 5.6.3
- Test plan: `tests/jmeter/backend-api-load.jmx`
- Endpoints testeados:
  - `GET /health` (10 threads, 3 loops)
  - `GET /barbershops` (20 threads, 5 loops)
  - `POST /auth/register` (15 threads, 2 loops)
  - `POST /auth/login` (15 threads, 3 loops)
  - `GET /appointments` (25 threads, 5 loops)
- Validación: falla si error rate > 10%
- Reportes HTML publicados como artefactos

## 📊 Testing

### Cobertura Objetivo
- **Target**: 100% coverage
- **Mínimo**: 100 tests unitarios
- Tests unitarios para cada módulo
- Tests e2e para flujos críticos

### Estructura de Tests
```
src/
  auth/*.spec.ts          # Tests de autenticación
  users/*.spec.ts         # Tests de usuarios
  appointments/*.spec.ts  # Tests de citas
  visagism/*.spec.ts      # Tests de análisis facial
  dto/*.spec.ts          # Tests de validación
test/
  *.e2e-spec.ts          # Tests end-to-end
coverage/
  lcov.info              # Reporte LCOV
  cobertura-coverage.xml # Reporte Cobertura
  junit.xml              # Resultados JUnit
```

### Comandos de Testing
```bash
# Todos los tests
npm run test

# Tests con coverage
npm run test:cov

# Tests e2e
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

## 🔗 Principales Endpoints API

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Login con JWT

### Usuarios
- `GET /users/me/:id` - Perfil del usuario
- `PUT /users/profile/:id` - Actualizar perfil

### Barberías
- `POST /barbershops` - Crear barbería
- `POST /barbershops/:id/barbers` - Agregar barbero
- `GET /barbershops` - Listar barberías

### Citas
- `POST /appointments` - Crear cita
- `PUT /appointments/:id/cancel` - Cancelar cita
- `GET /appointments/user/:userId` - Citas del usuario

### Visagismo
- `POST /visagism/analyze` - Análisis facial (imagen)

### Estilos
- `POST /hairstyles` - Crear estilo
- `GET /hairstyles/filter?faceShape=oval` - Filtrar estilos

### Admin
- `GET /admin/dashboard` - Dashboard con estadísticas

## 🔄 Flujos de Negocio Clave

### 1. Flujo de Agendamiento
```
Usuario autenticado 
→ Verifica disponibilidad (GET /appointments/barber/:id)
→ Crea cita (POST /appointments)
→ Sistema valida disponibilidad
→ Guarda en BD
→ NotificationsService envía confirmación
→ Response 201 Created
```

### 2. Flujo de Visagismo
```
Usuario sube imagen (POST /visagism/analyze)
→ Backend procesa con VisagismService
→ (Futuro: llamada a ML Kit/MediaPipe)
→ Análisis simulado detecta forma facial
→ Aplica reglas de recomendación
→ Filtra estilos del catálogo (HairstylesModule)
→ Response con recomendaciones ordenadas
```

### 3. Flujo de Notificaciones
```
Evento: AppointmentCreated
→ AppointmentsService emite evento
→ NotificationsService escucha evento
→ Prepara payload para OneSignal
→ (Futuro: llamada HTTP a OneSignal API)
→ Log de notificación enviada
```

## 🗃️ Esquema de Base de Datos

### Entidades Principales

```typescript
// User Entity
class User {
  id: number;
  email: string;
  password: string; // bcrypt hashed
  role: 'client' | 'barber' | 'admin';
  profile: UserProfile; // OneToOne
  appointments: Appointment[]; // OneToMany
}

// UserProfile Entity
class UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  preferences: object;
  user: User; // OneToOne
}

// Appointment Entity
class Appointment {
  id: number;
  date: DateTime;
  status: 'pending' | 'confirmed' | 'cancelled';
  user: User; // ManyToOne
  barber: Barber; // ManyToOne
  barbershop: Barbershop; // ManyToOne
  hairstyle?: Hairstyle; // ManyToOne (opcional)
}

// Barbershop Entity
class Barbershop {
  id: number;
  name: string;
  address: string;
  phone: string;
  barbers: Barber[]; // OneToMany
  appointments: Appointment[]; // OneToMany
}

// Barber Entity
class Barber {
  id: number;
  name: string;
  specialties: string[];
  barbershop: Barbershop; // ManyToOne
  appointments: Appointment[]; // OneToMany
}

// Hairstyle Entity (Catálogo)
class Hairstyle {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  recommendedFaceShapes: string[]; // ['oval', 'square', 'round']
  popularity: number;
  appointments: Appointment[]; // OneToMany
}

// FaceAnalysisResult Entity
class FaceAnalysisResult {
  id: number;
  userId: number;
  faceShape: string;
  confidence: number;
  recommendations: object;
  imageUrl: string;
  createdAt: DateTime;
}
```

## 🛠️ Configuración y Variables de Entorno

### Archivo `.env`
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=barbermatch_user
DB_PASSWORD=secure_password
DB_DATABASE=barbermatch_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d

# Server
PORT=3000
NODE_ENV=development

# External Services (Ready)
ONESIGNAL_APP_ID=your_app_id
ONESIGNAL_API_KEY=your_api_key
ML_KIT_API_URL=https://api.mlkit.example.com
```

## 📚 Integraciones Externas

### ML Kit / MediaPipe (Ready)
- **Módulo**: VisagismModule
- **Servicio**: `ImageAnalysisService` (preparado)
- **Uso**: Análisis facial para detectar forma de rostro
- **Estado**: Simulación implementada, listo para integración real

### OneSignal (Ready)
- **Módulo**: NotificationsModule
- **Servicio**: `NotificationsService` (preparado)
- **Uso**: Notificaciones push a usuarios
- **Estado**: Estructura lista, pendiente configuración API Key

## 🎯 Próximos Pasos Recomendados

1. **Integración Real de Servicios Externos**
   - Implementar cliente HTTP para ML Kit/MediaPipe
   - Configurar OneSignal con API Keys
   - Testing de integraciones

2. **Mejoras de Testing**
   - Aumentar cobertura a 100%
   - Más tests e2e de flujos completos
   - Tests de carga con JMeter

3. **Documentación API**
   - Integrar Swagger/OpenAPI
   - Ejemplos de requests/responses
   - Documentación de errores

4. **Optimizaciones de Performance**
   - Implementar caché con Redis
   - Optimizar queries con índices
   - Paginación en listados

5. **Seguridad Avanzada**
   - Rate limiting por endpoint
   - CORS configurado para producción
   - Helmet.js para headers HTTP seguros
   - Logs de auditoría

6. **Monitoreo y Observabilidad**
   - Integración con Application Insights
   - Logs estructurados
   - Métricas de performance
   - Alertas automatizadas

## 📞 Soporte y Referencias

- **Documentación NestJS**: https://docs.nestjs.com
- **TypeORM**: https://typeorm.io
- **SonarCloud Dashboard**: https://sonarcloud.io/organizations/iduertom
- **Azure DevOps**: Pipeline configurado en `azure-pipelines.yml`
- **Repositorio**: Consulta README principal para información adicional

---

> **Nota**: Este documento está sincronizado con la implementación actual. Para cambios en endpoints o módulos, actualiza esta documentación.

> **Testing Status**: Objetivo de 100% coverage con >100 tests unitarios implementados.

> **CI/CD Status**: Pipeline completo con 5 stages (Build, SonarCloud, Security, Deploy, JMeter) operativo.

**Última actualización**: Diciembre 2025