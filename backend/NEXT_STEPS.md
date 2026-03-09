# ✅ Backend Instalado - Próximos Pasos

## Estado Actual

✅ Python 3.14.1 instalado
✅ MySQL/MariaDB corriendo
✅ Entorno virtual creado
✅ Dependencias instaladas
✅ Estructura de archivos creada
✅ Configuración lista

## Configurar Base de Datos

### Opción 1: Usando el script SQL (Recomendado)
```bash
cd backend
sudo mysql < setup_mysql.sql
```

### Opción 2: Manual
```bash
sudo mysql
```

Luego ejecutar:
```sql
CREATE DATABASE pevolutions_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pevolutions_user'@'localhost' IDENTIFIED BY 'pevolutions_password';
GRANT ALL PRIVILEGES ON pevolutions_db.* TO 'pevolutions_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Crear Tablas

Después de configurar la base de datos:

```bash
cd backend
source venv/bin/activate
python init_db.py
```

## Ejecutar el Servidor

```bash
cd backend
./run.sh
```

O manualmente:
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Verificar Instalación

Una vez el servidor esté corriendo:

- **API Root**: http://localhost:8000
- **Documentación Swagger**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Probar Endpoints

### Registro de usuario
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "country": "US"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

## Estructura Creada

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # ✅ Aplicación FastAPI con CORS
│   ├── config.py        # ✅ Configuración desde .env
│   ├── database.py      # ✅ Conexión SQLAlchemy
│   ├── models.py        # ✅ Modelos User y Character
│   ├── schemas.py       # ✅ Schemas Pydantic
│   ├── crud.py          # ✅ Operaciones CRUD
│   ├── auth.py          # ✅ JWT y bcrypt
│   └── routers/
│       ├── __init__.py
│       └── auth.py      # ✅ Endpoints /register y /login
├── venv/                # ✅ Entorno virtual
├── .env                 # ✅ Variables de entorno
├── .env.example         # ✅ Ejemplo de configuración
├── .gitignore           # ✅ Archivos a ignorar
├── requirements.txt     # ✅ Dependencias
├── init_db.py          # ✅ Script para crear tablas
├── setup_mysql.sql     # ✅ Script SQL de configuración
├── run.sh              # ✅ Script para ejecutar servidor
└── README.md           # ✅ Documentación

```

## Configuración Actual

### Variables de Entorno (.env)
- `DATABASE_URL`: mysql+pymysql://pevolutions_user:pevolutions_password@localhost:3306/pevolutions_db
- `SECRET_KEY`: Generada automáticamente
- `FRONTEND_URL`: http://localhost:4321
- `PORT`: 8000

### Modelos de Base de Datos

**users**
- id (PK)
- username (unique)
- email (unique)
- password_hash
- country
- created_at

**characters**
- id (PK)
- user_id (FK → users)
- name (unique)
- gender (boy/girl)
- level (default: 1)
- created_at

## Cambiar Contraseña de MySQL (Opcional)

Si quieres usar una contraseña diferente:

1. Editar `backend/.env`:
   ```env
   DATABASE_URL=mysql+pymysql://pevolutions_user:TU_NUEVA_PASSWORD@localhost:3306/pevolutions_db
   ```

2. Editar `backend/setup_mysql.sql`:
   ```sql
   CREATE USER IF NOT EXISTS 'pevolutions_user'@'localhost' IDENTIFIED BY 'TU_NUEVA_PASSWORD';
   ```

## Solución de Problemas

### Error: "Can't connect to MySQL server"
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Error: "Access denied for user"
Verificar que el usuario y contraseña en `.env` coincidan con los de MySQL.

### Error: "Module not found"
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

## Siguiente Fase

Una vez que el backend esté funcionando:

1. ✅ Integrar frontend Astro con la API
2. ✅ Crear endpoints adicionales (characters, players online)
3. ✅ Implementar autenticación JWT en el frontend
4. ✅ Migrar datos de localStorage a la API

---

**¿Listo para configurar la base de datos?** Ejecuta:
```bash
cd backend
sudo mysql < setup_mysql.sql
python init_db.py
./run.sh
```
