# Guía Paso a Paso: Configuración de PostgreSQL para BarberMatch Backend

## 1. Instalar PostgreSQL
- Descarga el instalador desde [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- Ejecuta el instalador y sigue los pasos:
  - Elige la versión recomendada.
  - Selecciona el directorio de instalación.
  - Define una contraseña para el usuario `postgres` (guárdala, la necesitarás).
  - Finaliza la instalación.

## 2. Acceder a la Consola de PostgreSQL
- Abre la aplicación **pgAdmin** (instalada junto con PostgreSQL) o usa la terminal:
  - En Windows, busca "SQL Shell (psql)" y ábrela.

## 3. Crear la Base de Datos
### Usando pgAdmin:
1. Abre pgAdmin y conecta al servidor local.
2. Haz clic derecho en "Databases" > "Create" > "Database..."
3. Nombre: `barbermatch`
4. Owner: `postgres`
5. Haz clic en "Save".

### Usando la terminal (psql):
1. Ingresa tu contraseña cuando se solicite.
2. Ejecuta:
   ```sql
   CREATE DATABASE barbermatch;
   ```

## 4. Verificar la Base de Datos
- En pgAdmin, asegúrate que `barbermatch` aparece en la lista de bases de datos.
- En la terminal, ejecuta:
  ```sql
  \l
  ```
  para listar todas las bases de datos.

## 5. Configuración en el Backend
- El backend ya está configurado para conectarse a:
  - Host: `localhost`
  - Puerto: `5432`
  - Usuario: `postgres`
  - Contraseña: la que definiste
  - Base de datos: `barbermatch`
- Si necesitas cambiar estos datos, edita el archivo `app.module.ts` en la sección de TypeORM.

## 6. Iniciar el Backend
- En la terminal del proyecto, ejecuta:
  ```bash
  npm run start:dev
  ```
- Si todo está correcto, el backend se conectará y creará las tablas automáticamente.

## 7. Solución de Problemas
- Si ves errores de conexión:
  - Verifica que PostgreSQL esté corriendo.
  - Revisa usuario, contraseña y nombre de la base.
  - Asegúrate que el puerto 5432 no esté bloqueado por firewall.

---

> ¡Listo! Ahora puedes usar el backend y probar los endpoints.
