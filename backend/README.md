# PEvolutions Backend API

Backend API para PEvolutions Pokemon Game construido con FastAPI y MySQL.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)

## 🛠️ Tecnologías

### Backend Framework
- **FastAPI** 0.135.1 - Framework web moderno y rápido
- **Uvicorn** 0.41.0 - Servidor ASGI de alto rendimiento
- **Python** 3.8+ (Recomendado: 3.10+)

### Base de Datos
- **MySQL** 8.0+ o **MariaDB** 10.5+
- **SQLAlchemy** 2.0.48 - ORM para Python
- **PyMySQL** 1.1.2 - Driver MySQL para Python

### Autenticación y Seguridad
- **python-jose** 3.5.0 - JWT (JSON Web Tokens)
- **passlib** 1.7.4 - Hashing de contraseñas
- **bcrypt** 5.0.0 - Algoritmo de hashing

### Validación y Configuración
- **Pydantic** 2.12.5 - Validación de datos
- **pydantic-settings** 2.13.1 - Gestión de configuración
- **python-dotenv** 1.2.2 - Variables de entorno

### Utilidades
- **python-multipart** 0.0.22 - Manejo de formularios

## 📦 Requisitos Previos

Antes de instalar el backend, asegúrate de tener instalado:

### 1. Python 3.8+
```bash
# Verificar versión
python3 --version

# Si no está instalado (Ubuntu/Debian)
sudo apt update
sudo apt install python3 python3-pip python3-venv

# Si no está instalado (Fedora/RHEL)
sudo dnf install python3 python3-pip

# Si no está instalado (macOS con Homebrew)
brew install python3
```

### 2. MySQL o MariaDB
```bash
# Verificar si está instalado
mysql --version

# Instalar MySQL (Ubuntu/Debian)
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Instalar MariaDB (Ubuntu/Debian)
sudo apt install mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Instalar MySQL (macOS con Homebrew)
brew install mysql
brew services start mysql

# Configuración inicial de seguridad
sudo mysql_secure_installation
```

### 3. Git (opcional, para clonar el repositorio)
```bash
# Verificar instalación
git --version

# Instalar (Ubuntu/Debian)
sudo apt install git
```

### 4. Dependencias del Sistema (para compilar paquetes Python)
```bash
# Ubuntu/Debian
sudo apt install build-essential libssl-dev libffi-dev python3-dev

# Fedora/RHEL
sudo dnf install gcc openssl-devel libffi-devel python3-devel

# macOS (con Xcode Command Line Tools)
xcode-select --install
```

## 🚀 Instalación

### 1. Navegar al directorio del backend
```bash
cd backend
```

### 2. Crear entorno virtual
```bash
python3 -m venv venv
```

### 3. Activar entorno virtual
```bash
# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 4. Actualizar pip
```bash
pip install --upgrade pip
```

### 5. Instalar dependencias
```bash
pip install -r requirements.txt
```

## ⚙️ Configuración

### 1. Configurar MySQL

#### Opción A: Usando el script SQL (Recomendado)
```bash
sudo mysql < setup_mysql.sql
```

#### Opción B: Manual
```bash
# Conectar a MySQL como root
sudo mysql

# O si tienes contraseña configurada
mysql -u root -p
```

Ejecutar los siguientes comandos SQL:
```sql
CREATE DATABASE pevolutions_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pevolutions_user'@'localhost' IDENTIFIED BY 'pevolutions_password';
GRANT ALL PRIVILEGES ON pevolutions_db.* TO 'pevolutions_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Configurar Variables de Entorno

El archivo `.env` ya está creado con valores por defecto. Para personalizarlo:

```bash
# Editar el archivo .env
nano .env  # o vim .env, o code .env
```

Variables disponibles:
```env
# Conexión a la base de datos
DATABASE_URL=mysql+pymysql://usuario:contraseña@host:puerto/nombre_db

# Seguridad JWT
SECRET_KEY=tu-clave-secreta-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (URL del frontend)
FRONTEND_URL=http://localhost:4321

# Servidor
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

**⚠️ IMPORTANTE:** 
- Cambia `SECRET_KEY` en producción
- Cambia la contraseña de MySQL en producción
- Establece `DEBUG=False` en producción

### 3. Crear Tablas en la Base de Datos

```bash
# Asegúrate de estar en el directorio backend con el entorno virtual activado
python init_db.py
```

Esto creará las siguientes tablas:
- `users` - Usuarios del sistema
- `characters` - Personajes de los usuarios

### 4. Verificar Conexión a la Base de Datos

```bash
# Probar conexión
python -c "from app.database import engine; print('✓ Conexión exitosa' if engine.connect() else '✗ Error de conexión')"
```

## 🎮 Uso

### Ejecutar el Servidor

#### Opción A: Usando el script (Recomendado)
```bash
./run.sh
```

#### Opción B: Manual
```bash
# Activar entorno virtual si no está activado
source venv/bin/activate

# Ejecutar servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Opción C: Modo producción (sin auto-reload)
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Verificar que el Servidor Está Corriendo

Abre tu navegador en:
- **API Root**: http://localhost:8000
- **Documentación Interactiva (Swagger)**: http://localhost:8000/docs
- **Documentación Alternativa (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📡 Endpoints

### Autenticación

#### Registrar Usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "contraseña_segura",
  "country": "US"
}
```

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "username": "usuario123",
  "email": "usuario@example.com",
  "country": "US",
  "created_at": "2026-03-08T21:00:00"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "usuario123",
  "password": "contraseña_segura"
}
```

**Respuesta exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Utilidades

#### Health Check
```http
GET /health
```

**Respuesta:**
```json
{
  "status": "healthy"
}
```

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py           # Inicialización del paquete
│   ├── main.py               # Aplicación FastAPI principal
│   ├── config.py             # Configuración y variables de entorno
│   ├── database.py           # Configuración de SQLAlchemy
│   ├── models.py             # Modelos de base de datos (User, Character)
│   ├── schemas.py            # Schemas Pydantic para validación
│   ├── crud.py               # Operaciones CRUD
│   ├── auth.py               # Utilidades de autenticación (JWT, bcrypt)
│   └── routers/
│       ├── __init__.py
│       └── auth.py           # Endpoints de autenticación
├── venv/                     # Entorno virtual (no incluir en git)
├── .env                      # Variables de entorno (no incluir en git)
├── .env.example              # Ejemplo de variables de entorno
├── .gitignore                # Archivos a ignorar en git
├── requirements.txt          # Dependencias Python
├── init_db.py               # Script para crear tablas
├── setup_mysql.sql          # Script SQL para configurar MySQL
├── run.sh                   # Script para ejecutar el servidor
├── README.md                # Este archivo
├── NEXT_STEPS.md            # Guía de próximos pasos
└── INSTALLATION_COMPLETE.txt # Resumen de instalación
```

## 🔧 Solución de Problemas

### Error: "Can't connect to MySQL server"
```bash
# Verificar que MySQL está corriendo
sudo systemctl status mysql
# o
sudo systemctl status mariadb

# Iniciar MySQL si no está corriendo
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Error: "Access denied for user"
- Verifica que las credenciales en `.env` coincidan con las de MySQL
- Verifica que el usuario tenga permisos en la base de datos:
```sql
SHOW GRANTS FOR 'pevolutions_user'@'localhost';
```

### Error: "Module not found"
```bash
# Asegúrate de estar en el entorno virtual
source venv/bin/activate

# Reinstalar dependencias
pip install -r requirements.txt
```

### Error: "Port 8000 already in use"
```bash
# Encontrar el proceso usando el puerto
lsof -i :8000

# Matar el proceso (reemplaza PID con el número del proceso)
kill -9 PID

# O usar otro puerto
uvicorn app.main:app --reload --port 8001
```

### Error al compilar paquetes Python
```bash
# Instalar dependencias del sistema
sudo apt install build-essential libssl-dev libffi-dev python3-dev
```

## 🔐 Seguridad

- Las contraseñas se hashean con bcrypt antes de almacenarse
- Los tokens JWT expiran en 30 minutos (configurable)
- CORS configurado para permitir solo el frontend especificado
- Usa HTTPS en producción
- Cambia `SECRET_KEY` y contraseñas en producción
- No expongas el archivo `.env` en repositorios públicos

## 📚 Recursos Adicionales

- [Documentación de FastAPI](https://fastapi.tiangolo.com/)
- [Documentación de SQLAlchemy](https://docs.sqlalchemy.org/)
- [Documentación de Pydantic](https://docs.pydantic.dev/)
- [Documentación de MySQL](https://dev.mysql.com/doc/)

## 📝 Notas

- El servidor se ejecuta en modo desarrollo con auto-reload por defecto
- Para producción, usa un servidor ASGI como Gunicorn con Uvicorn workers
- Considera usar migraciones con Alembic para cambios en la base de datos
- Implementa rate limiting para endpoints públicos en producción
