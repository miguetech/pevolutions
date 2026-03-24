# PEvolutions Backend API

Backend completo para el juego PEvolutions - Sistema de gestión de cuentas, personajes, eventos y monetización.

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Configurar .env
cp .env.example .env
# Editar .env y cambiar:
# - DATABASE_URL (credenciales de MySQL)
# - SECRET_KEY (generar con: openssl rand -hex 32)

# 3. Inicializar base de datos
python init_database.py

# 4. Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

**Servidor:** http://localhost:8000  
**Documentación:** http://localhost:8000/docs

---

## 📚 Documentación Completa

Ver **[docs/README.md](docs/README.md)** para documentación completa:
- 🚀 Guía de inicio rápido
- 📡 Referencia de API
- 🏗️ Arquitectura del sistema
- 👨‍💻 Guías de desarrollo

---

## 📊 Endpoints Implementados

**17 endpoints (77% completado)**

### 🔐 Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login (JWT)

### 👤 Cuenta
- `PUT /api/account/password` - Cambiar contraseña
- `PUT /api/account/settings` - Actualizar email/país
- `GET /api/account/stats` - Estadísticas

### 🎮 Personajes
- `GET /api/players/` - Mis personajes
- `POST /api/players/` - Crear personaje
- `GET /api/players/{name}` - Ver personaje
- `PUT /api/players/{name}` - Actualizar personaje
- `DELETE /api/players/{name}` - Eliminar personaje
- `GET /api/players/{name}/pokemon` - Equipo pokemon
- `GET /api/players/{name}/stats` - Estadísticas detalladas
- `GET /api/players/online` - Jugadores online

### 🌐 Comunidad
- `GET /api/events` - Eventos del juego
- `GET /api/guilds` - Top guilds

### 💎 Shop
- `GET /api/shop/packages` - Paquetes premium
- `GET /api/shop/premium` - Estado premium

---

## 🛠️ Tecnologías

- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para MySQL
- **JWT** - Autenticación segura
- **Bcrypt** - Hash de contraseñas
- **Pydantic** - Validación de datos

---

## 📚 Documentación

- **[QUICKSTART.md](QUICKSTART.md)** - Guía de inicio rápido
- **[API_ENDPOINTS.md](API_ENDPOINTS.md)** - Documentación completa de API
- **[IMPLEMENTACION_COMPLETA.md](IMPLEMENTACION_COMPLETA.md)** - Resumen de implementación
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Arquitectura del sistema

---

## 🧪 Pruebas

```bash
# Ejecutar tests automatizados (recomendado)
python tests/test_all_endpoints.py

# Probar endpoint público
curl http://localhost:8000/api/players/online
```

**Ver:** `tests/TESTING_GUIDE.md` para más opciones de prueba (REST Client, Thunder Client, bash)

---

## 📈 Estado del Proyecto

| Fase | Endpoints | Estado |
|------|-----------|--------|
| FASE 1 - MVP | 10 | ✅ 100% |
| FASE 2 - Funcionalidad | 3 | ✅ 100% |
| FASE 3 - Comunidad | 2 | ✅ 100% |
| FASE 4 - Monetización | 2 | ✅ 100% |

**Total: 17/22 endpoints implementados**

---

## 🔧 Configuración

### Variables de Entorno (.env)

```env
DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/Pevolutions
SECRET_KEY=tu_clave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
FRONTEND_URL=http://localhost:4321
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

---

## 🐛 Troubleshooting

Ver **[QUICKSTART.md](QUICKSTART.md)** para solución de problemas comunes.

---

## 📝 Licencia

Proyecto privado - PEvolutions
