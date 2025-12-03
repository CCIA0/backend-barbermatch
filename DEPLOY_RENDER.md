# BarberMatch Backend - Deploy en Render

Este proyecto está configurado para deployarse automáticamente en Render usando Infrastructure as Code.

## ⚠️ Importante: Repositorio Separado

Este proyecto usa **dos repositorios**:
- **Azure DevOps** (`CCIA0/BarberMatch-backend`): Para CI/CD con Azure Pipelines
- **GitHub** (`CCIA0/backend-barbermatch`): Para deploy automático en Render

Los cambios deben pushearse a ambos repositorios según sea necesario.

## 🔧 Configuración Optimizada

El proyecto está configurado con las siguientes optimizaciones para Render:

- ✅ **Node.js 20**: Especificado en `.node-version`
- ✅ **Dependencias de Build**: TypeScript, @nestjs/cli en `dependencies` (no devDependencies)
- ✅ **npm ci**: Para instalación reproducible y rápida
- ✅ **PostgreSQL 16**: Base de datos actualizada
- ✅ **Región Oregon**: Para mejor rendimiento
- ✅ **Health Check**: Endpoint `/health` para monitoreo

## 📋 Configuración de Deploy

### 1. Preparación del Repositorio

Los cambios ya están en GitHub. Para verificar:

```bash
# Ver remotes configurados
git remote -v

# Deberías ver:
# origin   https://dev.azure.com/... (Azure DevOps)
# github   https://github.com/CCIA0/backend-barbermatch.git (GitHub)

# Push a GitHub para deploy en Render
git push github main

# Push a Azure DevOps para pipelines
git push origin master
```

### 2. Deploy en Render

1. **Conecta tu repositorio a Render:**
   - Ve a [Render Dashboard](https://dashboard.render.com/)
   - Click en "New +" y selecciona "Blueprint"
   - Conecta tu repositorio de GitHub
   - Selecciona la rama `main`
   - Render detectará automáticamente el archivo `render.yaml`

2. **Configuración automática:**
   - Render creará automáticamente:
     - Un servicio web para el backend
     - Una base de datos PostgreSQL
   - Las variables de entorno se configuran automáticamente

### 3. Variables de Entorno

Las siguientes variables se configuran automáticamente:

- `NODE_ENV=production`
- `PORT=10000`
- `DATABASE_URL` (conectada automáticamente a la BD)
- `JWT_SECRET` (generada automáticamente)
- `BCRYPT_ROUNDS=10`

### 4. Verificación del Deploy

Una vez completado el deploy, puedes verificar que funciona:

- **Health Check:** `https://tu-app.onrender.com/health`
- **API Base:** `https://tu-app.onrender.com/`

### 5. Configuración del Frontend

Actualiza tu frontend para usar la URL de Render:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://barbermatch-backend.onrender.com'
  : 'http://localhost:3000';
```

## Características del Deploy

- ✅ **Gratis:** Usando el plan free de Render
- ✅ **Base de datos:** PostgreSQL incluida
- ✅ **HTTPS:** Certificado SSL automático
- ✅ **Auto-deploy:** Se redeploya automáticamente con cada push
- ✅ **Health checks:** Monitoreo automático de salud
- ✅ **Variables de entorno:** Configuración automática

## Limitaciones del Plan Free

- **Sleep mode:** El servicio se "duerme" después de 15 minutos de inactividad
- **Cold starts:** Puede tomar 30-60 segundos despertar
- **750 horas/mes:** Límite de tiempo activo mensual

## Troubleshooting

### ✅ Problemas Resueltos

#### 1. Error de Build - "Cannot find module typescript"
**Solución:** Movidas las dependencias de build (`typescript`, `@nestjs/cli`, `ts-node`, `tsconfig-paths`) a `dependencies` en lugar de `devDependencies`. Render necesita estas dependencias para compilar el código.

#### 2. Versión de Node.js incorrecta
**Solución:** Agregado archivo `.node-version` con `20` para especificar Node.js 20.x.

#### 3. Instalación lenta o inestable
**Solución:** Cambiado de `npm install` a `npm ci` en `render.yaml` para instalación más rápida y reproducible.

#### 4. Error al iniciar la aplicación
**Solución:** Cambio de `node dist/main` a `node dist/main.js` para especificar correctamente el archivo de entrada.

### 🔍 Problemas Comunes

### El servicio no inicia
1. **Verifica los logs** en Render Dashboard → tu servicio → Logs
2. Asegúrate de que `npm run build` funcione localmente:
   ```bash
   npm run build
   node dist/main.js
   ```
3. Verifica que todas las dependencias necesarias estén en `dependencies`

### Error de base de datos
1. Verifica que la variable `DATABASE_URL` esté configurada
2. Los logs mostrarán errores de conexión específicos

### CORS issues
1. Verifica que el frontend esté en la lista de orígenes permitidos
2. Actualiza la configuración de CORS en `main.ts` si es necesario

## Comandos útiles

```bash
# Verificar que el build funciona localmente
npm run build
npm run start:prod

# Ver logs de producción
# (En Render Dashboard > tu servicio > Logs)

# Pushear cambios a GitHub (para Render)
git push github main

# Pushear cambios a Azure DevOps (para pipelines CI/CD)
git push origin master
```

## 📝 Workflow de Desarrollo

### Dos repositorios, dos propósitos:

1. **Desarrollo y CI/CD (Azure DevOps)**:
   - Tests automáticos
   - Análisis de código con SonarQube
   - Pipelines de integración continua
   
2. **Deploy en Producción (GitHub + Render)**:
   - Deploy automático con cada push
   - Infraestructura como código
   - Hosting y base de datos gratuitos

### Para hacer cambios:

```bash
# 1. Hacer cambios en el código
git add .
git commit -m "feat: nueva funcionalidad"

# 2. Push a Azure DevOps (ejecuta tests y pipelines)
git push origin master

# 3. Si todo está bien, push a GitHub (deploy automático en Render)
git push github main
```

## 🔄 Respecto al Pipeline de Azure

### ¿Debo quitar el stage de Azure Web Apps?

**Opción 1 - Mantener ambos (Recomendado para desarrollo)**:
- Deja Azure Web Apps en el pipeline para **staging/desarrollo**
- Usa Render para **producción**
- Ventaja: Puedes probar en Azure antes de deployar a producción

**Opción 2 - Solo Render**:
Si decides usar solo Render, puedes:

1. **Comentar** el stage de deploy en `azure-pipelines.yml`:
```yaml
# - stage: Deploy
#   displayName: 'Deploy to Azure Web App'
#   dependsOn: Build
#   condition: succeeded()
#   jobs:
#   - deployment: DeployWeb
#     # ... resto del stage comentado
```

2. O **eliminarlo** completamente si ya no usarás Azure Web Apps

3. Mantener solo los stages de:
   - Build
   - Test
   - SonarQube Analysis

### Pipeline simplificado (solo CI, sin CD a Azure):

```yaml
stages:
  - stage: Build
    # ... configuración de build
  
  - stage: Test
    # ... ejecución de tests
  
  - stage: SonarAnalysis
    # ... análisis de código
  
  # Deploy se hace automáticamente en Render via GitHub
```