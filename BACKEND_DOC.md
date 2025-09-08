# Documentación Técnica - Backend BarberMatch

## Estructura General
El backend está desarrollado con NestJS y TypeORM, siguiendo una arquitectura modular. Cada módulo representa una funcionalidad principal del sistema.

### Módulos Implementados
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

> Para dudas sobre endpoints, entidades o flujos, consulta este archivo y el README principal.
