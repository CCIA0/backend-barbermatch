# BarberMatch Backend - Deploy en Render

Este proyecto está configurado para deployarse automáticamente en Render usando Infrastructure as Code.

## Configuración de Deploy

### 1. Preparación del Repositorio

Asegúrate de que todos los cambios estén commitados y pusheados a tu repositorio de GitHub:

```bash
git add .
git commit -m "feat: configuración para deploy en Render"
git push origin main
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

### El servicio no inicia
1. Verifica los logs en Render Dashboard
2. Asegúrate de que `npm run build` funcione localmente
3. Verifica que todas las dependencias estén en `dependencies` (no `devDependencies`)

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
```