# 🚀 Guía de Inicio Rápido

## Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configurar Base de Datos

Editar `.env` con tus credenciales:

```env
DATABASE_URL=mysql+pymysql://root:123456@localhost:3306/Pevolutions
SECRET_KEY=<generar con: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:4321
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

### 3. Inicializar Base de Datos

```bash
python init_database.py
```

### 4. Iniciar Servidor

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en: http://localhost:8000

---

## 📖 Documentación Interactiva

Una vez iniciado el servidor, accede a:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🧪 Pruebas Rápidas

### Endpoints Públicos

```bash
# Health check
curl http://localhost:8000/health

# Jugadores online
curl http://localhost:8000/api/players/online?limit=5

# Eventos
curl http://localhost:8000/api/events

# Guilds
curl http://localhost:8000/api/guilds

# Paquetes shop
curl http://localhost:8000/api/shop/packages
```

### Flujo Completo de Usuario

```bash
# 1. Registrar cuenta
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "testuser",
    "password": "test123",
    "email": "test@example.com"
  }'

# 2. Login (guardar el token)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "name": "testuser",
    "password": "test123"
  }'

# Respuesta: {"access_token": "eyJ...", "token_type": "bearer"}

# 3. Usar token en requests (reemplazar TOKEN)
TOKEN="tu_token_aqui"

# Ver mis personajes
curl http://localhost:8000/api/players/ \
  -H "Authorization: Bearer $TOKEN"

# Crear personaje
curl -X POST http://localhost:8000/api/players/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MyCharacter",
    "sex": 0
  }'

# Ver estadísticas de cuenta
curl http://localhost:8000/api/account/stats \
  -H "Authorization: Bearer $TOKEN"

# Ver estado premium
curl http://localhost:8000/api/shop/premium \
  -H "Authorization: Bearer $TOKEN"

# Cambiar contraseña
curl -X PUT http://localhost:8000/api/account/password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "test123",
    "new_password": "newpass456"
  }'
```

---

## 🐛 Troubleshooting

### Error: "Access denied for user"
- Verifica las credenciales en `.env`
- Asegúrate que MySQL esté corriendo

### Error: "email-validator not installed"
```bash
pip install email-validator
```

### Error: "Table doesn't exist"
```bash
python init_database.py
```

### Puerto 8000 en uso
```bash
# Usar otro puerto
uvicorn app.main:app --reload --port 8001
```

---

## 📚 Documentación Adicional

- `API_ENDPOINTS.md` - Documentación completa de endpoints
- `IMPLEMENTACION_COMPLETA.md` - Resumen de implementación
- `ARCHITECTURE.md` - Arquitectura del sistema
- `ENDPOINTS_CHECKLIST.md` - Checklist de progreso

---

## 🔗 Conectar con Frontend

El backend está configurado para aceptar requests desde:
- `http://localhost:4321` (Astro dev server)
- URL configurada en `FRONTEND_URL`

CORS está habilitado para desarrollo.

---

## 📊 Endpoints Disponibles

**Total: 17 endpoints**

- ✅ 2 Autenticación
- ✅ 3 Gestión de cuenta
- ✅ 7 Personajes
- ✅ 1 Jugadores online
- ✅ 2 Comunidad
- ✅ 2 Monetización

Ver lista completa en `API_ENDPOINTS.md`
