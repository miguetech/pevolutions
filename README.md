# PEvolutions

Juego de Pokémon Online (MMORPG) - Plataforma web con sistema de cuentas, personajes, eventos y monetización.

---

## ⚙️ Prerrequisitos

- **Python** 3.10+
- **Node.js** 18+
- **MySQL** 8.0+ corriendo localmente

---

## 📁 Estructura del Proyecto

```
pevolutions/
├── frontend/       # Interfaz web (Astro + React)
└── backend/        # API REST (FastAPI + MySQL)
```

---

## 🐳 Ejecución con Docker (Recomendado)

La forma más rápida de levantar todo el stack (MySQL + FastAPI + Astro/Nginx) sin instalar dependencias manualmente.

### 1. Prerrequisitos de Docker
Asegúrate de tener Docker instalado y el daemon activo:
```bash
# Iniciar daemon de Docker en Linux (si no está activo)
sudo systemctl start docker

# (Opcional) Habilitar inicio automático con el sistema
sudo systemctl enable docker
```

### 2. Levantar el proyecto
Desde la raíz del repositorio:
```bash
# Construir imágenes y levantar en segundo plano
docker compose up --build -d
```

### 3. Servicios disponibles
- **Frontend:** [http://localhost:4321](http://localhost:4321)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **MySQL Database:** `localhost:3306` (Base de datos: `pevolutions_db`, Usuario: `pevolutions_user`, Password: `pevolutions_password`)

### 4. Comandos útiles
```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico (ej: backend o frontend)
docker compose logs -f backend

# Detener todos los contenedores
docker compose down

# Detener y eliminar volúmenes (reiniciar base de datos desde cero)
docker compose down -v
```

---

## 💻 Ejecución Local (Sin Docker)

> ⚠️ Si prefieres correrlo sin Docker, levanta el **backend primero** — el frontend lo requiere para funcionar.

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # Configurar credenciales (ver abajo)
python init_database.py
uvicorn app.main:app --reload --port 8000
```
**API:** http://localhost:8000 | **Docs:** http://localhost:8000/docs

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
**App:** http://localhost:4321

---

## 🔧 Variables de Entorno (backend/.env)

| Variable | Descripción | Obligatoria |
|---|---|---|
| `DATABASE_URL` | Conexión a MySQL | ✅ |
| `SECRET_KEY` | Clave JWT (mín. 32 chars) | ✅ |
| `FRONTEND_URL` | URL del frontend para CORS | ✅ |
| `ALGORITHM` | Algoritmo JWT (default: HS256) | — |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token (default: 30) | — |

Generar `SECRET_KEY`:
```bash
openssl rand -hex 32
```

---

## 🛠️ Tecnologías

| Capa | Stack |
|---|---|
| Frontend | Astro, React, TypeScript, Jotai, TanStack Query |
| Backend | FastAPI, SQLAlchemy, MySQL, JWT, Bcrypt |

---

## 📊 Estado del Proyecto

| Fase | Estado |
|---|---|
| FASE 1 - MVP (Auth + Personajes) | ✅ Completo |
| FASE 2 - Cuenta y Stats | ✅ Completo |
| FASE 3 - Comunidad (Eventos, Guilds) | ✅ Completo |
| FASE 4 - Monetización (Shop) | ✅ Completo |

**17/22 endpoints implementados (77%)**

---

## 📚 Documentación

- **[backend/README.md](backend/README.md)** - API, endpoints y configuración del backend
- **[frontend/README.md](frontend/README.md)** - Interfaz, componentes y arquitectura del frontend

---

## 📝 Licencia

Proyecto privado - PEvolutions
