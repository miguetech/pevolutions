# Plan de Instalación Backend FastAPI + MySQL

## 1. Verificar Requisitos del Sistema

### Python
```bash
python3 --version  # Debe ser >= 3.8
```

### MySQL
```bash
mysql --version
# O verificar si está corriendo
sudo systemctl status mysql
```

### pip (gestor de paquetes Python)
```bash
pip3 --version
```

## 2. Estructura del Proyecto

```
pevolutions/
├── frontend/          # Mover proyecto Astro actual aquí
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/           # Nuevo directorio FastAPI
    ├── app/
    │   ├── __init__.py
    │   ├── main.py
    │   ├── database.py
    │   ├── models.py
    │   ├── schemas.py
    │   ├── crud.py
    │   └── routers/
    │       ├── __init__.py
    │       ├── auth.py
    │       ├── users.py
    │       └── characters.py
    ├── requirements.txt
    ├── .env
    └── README.md
```

## 3. Dependencias Python Necesarias

Crear `backend/requirements.txt`:
```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
pymysql==1.1.0
python-dotenv==1.0.0
pydantic==2.5.3
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

## 4. Configuración de MySQL

### Crear base de datos
```sql
CREATE DATABASE pevolutions_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pevolutions_user'@'localhost' IDENTIFIED BY 'tu_password_seguro';
GRANT ALL PRIVILEGES ON pevolutions_db.* TO 'pevolutions_user'@'localhost';
FLUSH PRIVILEGES;
```

### Verificar conexión
```bash
mysql -u pevolutions_user -p pevolutions_db
```

## 5. Variables de Entorno

Crear `backend/.env`:
```env
# Database
DATABASE_URL=mysql+pymysql://pevolutions_user:tu_password_seguro@localhost:3306/pevolutions_db

# Security
SECRET_KEY=genera_una_clave_secreta_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
FRONTEND_URL=http://localhost:4321

# Server
HOST=0.0.0.0
PORT=8000
```

## 6. Instalación Paso a Paso

### 6.1 Crear entorno virtual
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows
```

### 6.2 Instalar dependencias
```bash
pip install -r requirements.txt
```

### 6.3 Verificar instalación
```bash
pip list | grep -E "fastapi|sqlalchemy|pymysql"
```

## 7. Modelos de Base de Datos Necesarios

### Tablas principales:
- **users**: id, username, email, password_hash, country, created_at
- **characters**: id, user_id, name, gender, level, created_at
- **sessions**: id, user_id, token, expires_at

## 8. Endpoints API Necesarios

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuario actual

### Usuarios
- `GET /api/users/profile` - Perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil
- `PUT /api/users/password` - Cambiar contraseña

### Personajes
- `GET /api/characters` - Listar personajes del usuario
- `POST /api/characters` - Crear personaje
- `GET /api/characters/{id}` - Detalle de personaje
- `DELETE /api/characters/{id}` - Eliminar personaje

### Jugadores Online
- `GET /api/players/online` - Lista de jugadores conectados

## 9. Integración con Frontend

### Modificar Astro para usar API:
1. Crear cliente HTTP (fetch/axios)
2. Reemplazar `localStorage` por llamadas API
3. Manejar tokens JWT en cookies/localStorage
4. Configurar CORS en FastAPI

### Variables de entorno frontend:
```env
PUBLIC_API_URL=http://localhost:8000
```

## 10. Comandos de Ejecución

### Backend
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run dev
```

## 11. Testing de Conexión

### Verificar backend
```bash
curl http://localhost:8000/docs  # Swagger UI
curl http://localhost:8000/health
```

### Verificar conexión MySQL
```bash
# Desde Python
python3 -c "from sqlalchemy import create_engine; engine = create_engine('mysql+pymysql://user:pass@localhost/db'); print(engine.connect())"
```

## 12. Checklist Pre-Instalación

- [ ] Python 3.8+ instalado
- [ ] MySQL instalado y corriendo
- [ ] Base de datos creada
- [ ] Usuario MySQL creado con permisos
- [ ] pip actualizado (`pip install --upgrade pip`)
- [ ] Espacio en disco suficiente (>500MB)
- [ ] Puerto 8000 disponible
- [ ] Puerto 3306 (MySQL) disponible

## 13. Problemas Comunes

### Error: "Can't connect to MySQL server"
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Error: "ModuleNotFoundError: No module named 'MySQLdb'"
```bash
pip install pymysql
# O instalar mysqlclient: pip install mysqlclient
```

### Error: "Access denied for user"
```sql
-- Verificar permisos
SHOW GRANTS FOR 'pevolutions_user'@'localhost';
```

## 14. Próximos Pasos

1. Crear estructura de directorios backend
2. Instalar dependencias Python
3. Configurar base de datos MySQL
4. Implementar modelos SQLAlchemy
5. Crear endpoints FastAPI
6. Integrar frontend con API
7. Implementar autenticación JWT
8. Testing y validación
