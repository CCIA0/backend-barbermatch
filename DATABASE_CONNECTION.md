# 🗄️ Configuración de Base de Datos PostgreSQL - BarberMatch

## 📊 Parámetros de Conexión Actuales

### 🔗 Configuración Principal (app.module.ts)
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'barbermatch_user',
  password: 'barber123', 
  database: 'barber_db',
  synchronize: true,
})
```

### 🔧 Variables de Entorno (.env)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=visagismo_db
DB_SYNC=true
DB_LOGGING=false
```

## ⚠️ PROBLEMA IDENTIFICADO: Inconsistencia de Configuración

El proyecto tiene configuraciones diferentes entre `app.module.ts` y `.env`:

| Parámetro | app.module.ts | .env |
|-----------|---------------|------|
| Usuario | `barbermatch_user` | `postgres` |
| Contraseña | `barber123` | `password` |
| Base de Datos | `barber_db` | `visagismo_db` |

## ✅ Solución Recomendada

### 1. Usar Variables de Entorno en app.module.ts
```typescript
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: configService.get('DB_SYNC') === 'true',
        logging: configService.get('DB_LOGGING') === 'true',
        entities: [/* ... entidades ... */],
      }),
      inject: [ConfigService],
    }),
  ],
})
```

### 2. Configurar PostgreSQL Correctamente

#### 🚀 Opción A: Usar Usuario Postgres por Defecto
```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_NAME=barbermatch_db
DB_SYNC=true
DB_LOGGING=false
```

#### 🚀 Opción B: Crear Usuario Específico
```sql
-- En PostgreSQL (pgAdmin o psql)
CREATE USER barbermatch_user WITH PASSWORD 'barber123';
CREATE DATABASE barbermatch_db OWNER barbermatch_user;
GRANT ALL PRIVILEGES ON DATABASE barbermatch_db TO barbermatch_user;
```

```bash
# .env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=barbermatch_user
DB_PASSWORD=barber123
DB_NAME=barbermatch_db
DB_SYNC=true
DB_LOGGING=false
```

## 🔧 Comandos para Configurar PostgreSQL

### Usando psql (Línea de Comandos)
```bash
# Conectar como usuario postgres
psql -U postgres -h localhost

# Crear base de datos
CREATE DATABASE barbermatch_db;

# Crear usuario (opcional)
CREATE USER barbermatch_user WITH PASSWORD 'barber123';
GRANT ALL PRIVILEGES ON DATABASE barbermatch_db TO barbermatch_user;

# Verificar conexión
\l  # Listar bases de datos
\q  # Salir
```

### Usando pgAdmin (Interfaz Gráfica)
1. Abrir pgAdmin
2. Conectar al servidor local (localhost:5432)
3. Click derecho en "Databases" > "Create" > "Database"
4. Nombre: `barbermatch_db`
5. Owner: `postgres` (o `barbermatch_user` si lo creaste)

## 🧪 Verificar Conexión

### Método 1: Probar con psql
```bash
psql -h localhost -p 5432 -U postgres -d barbermatch_db
# O si usas usuario específico:
psql -h localhost -p 5432 -U barbermatch_user -d barbermatch_db
```

### Método 2: Iniciar la Aplicación
```bash
npm run start:dev
```

Si ves este mensaje, la conexión es exitosa:
```
[Nest] LOG [TypeOrmModule] Entity metadata for [...] was loaded.
```

## 📋 Entidades de Base de Datos

El proyecto incluye las siguientes entidades:
- ✅ **User**: Usuarios del sistema
- ✅ **UserProfile**: Perfiles de usuario  
- ✅ **Appointment**: Citas agendadas
- ✅ **Barbershop**: Información de barberías
- ✅ **Barber**: Barberos registrados
- ✅ **Hairstyle**: Catálogo de estilos
- ✅ **FaceAnalysisResult**: Resultados de análisis facial

## 🚨 Troubleshooting

### Error: "Database does not exist"
```bash
# Crear la base de datos
createdb -U postgres barbermatch_db
```

### Error: "Password authentication failed"
- Verificar contraseña en `.env`
- Asegurar que PostgreSQL esté corriendo
- Verificar que el usuario tenga permisos

### Error: "Connection refused"
- Verificar que PostgreSQL esté iniciado
- Comprobar puerto 5432 disponible
- Verificar firewall no bloquee la conexión

### Error: "role does not exist"
```sql
-- Crear el usuario faltante
CREATE USER barbermatch_user WITH PASSWORD 'barber123';
```

## ⚡ Comandos Rápidos

```bash
# Iniciar PostgreSQL (Windows)
net start postgresql-x64-13

# Verificar estado
pg_ctl status

# Conectar y crear todo de una vez
psql -U postgres -c "CREATE DATABASE barbermatch_db;"

# Iniciar aplicación
npm run start:dev
```

## 📝 Configuración Final Recomendada

### .env
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_NAME=barbermatch_db
DB_SYNC=true
DB_LOGGING=false
```

### Comando de Creación de DB
```sql
CREATE DATABASE barbermatch_db;
```

¡Con esta configuración tu aplicación BarberMatch debería conectarse exitosamente a PostgreSQL! 🎉