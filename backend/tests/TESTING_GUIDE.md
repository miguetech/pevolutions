# 🧪 Guía de Pruebas Rápidas - PEvolutions API

> **Nota:** Todos los archivos de prueba están en la carpeta `tests/`

Tienes **4 opciones** para probar los endpoints sin abrir Postman:

---

## 🐍 Opción 1: Script Python (Recomendado)

**Más completo y visual**

```bash
# Instalar requests si no lo tienes
pip install requests

# Ejecutar todas las pruebas (desde la raíz del proyecto)
python tests/test_all_endpoints.py
```

✅ **Ventajas:**
- Prueba todos los endpoints automáticamente
- Muestra resultados con emojis
- Crea usuario de prueba automáticamente
- No necesitas copiar/pegar tokens

---

## 🔌 Opción 2: REST Client (VSCode)

**Ideal para desarrollo en VSCode**

1. Instalar extensión: **REST Client** (humao.rest-client)
2. Abrir archivo: `tests/api-tests.http`
3. Click en **"Send Request"** sobre cada petición

✅ **Ventajas:**
- Integrado en VSCode
- Sintaxis simple
- Guarda historial de respuestas
- No necesitas terminal

📝 **Uso:**
1. Ejecutar "Login" primero
2. Copiar el `access_token` de la respuesta
3. Pegar en la variable `@token` al inicio del archivo
4. Ejecutar los demás endpoints

---

## ⚡ Opción 3: Thunder Client (VSCode)

**Alternativa a Postman en VSCode**

1. Instalar extensión: **Thunder Client**
2. Importar colección: `tests/thunder-collection.json`
3. Usar la colección desde el panel lateral

✅ **Ventajas:**
- Interfaz gráfica como Postman
- Organizado por carpetas
- Variables de entorno incluidas
- Guarda automáticamente el token

---

## 🔧 Opción 4: Script Bash + curl

**Para terminal lovers**

```bash
# Ejecutar pruebas rápidas (desde la raíz del proyecto)
./tests/quick-test.sh
```

✅ **Ventajas:**
- Ultra rápido
- No necesita dependencias (solo curl y jq)
- Perfecto para CI/CD
- Resultados en JSON formateado

---

## 📊 Comparación

| Opción | Velocidad | Facilidad | Completo | Automatizado |
|--------|-----------|-----------|----------|--------------|
| Python Script | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| REST Client | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Thunder Client | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Bash Script | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🚀 Inicio Rápido

### 1. Iniciar el servidor
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### 2. Ejecutar pruebas (en otra terminal)
```bash
# Opción más rápida
python tests/test_all_endpoints.py

# O con bash
./tests/quick-test.sh
```

---

## 📝 Endpoints Disponibles

### ✅ Implementados (17/22)

**Auth (2)**
- POST `/api/auth/register` - Registro
- POST `/api/auth/login` - Login

**Players (7)**
- GET `/api/players/` - Mis jugadores
- POST `/api/players/` - Crear jugador
- GET `/api/players/{name}` - Ver jugador
- PUT `/api/players/{name}` - Actualizar jugador
- DELETE `/api/players/{name}` - Eliminar jugador
- GET `/api/players/{name}/stats` - Estadísticas
- GET `/api/players/online` - Jugadores online

**Account (3)**
- GET `/api/account/stats` - Estadísticas cuenta
- PUT `/api/account/password` - Cambiar contraseña
- PUT `/api/account/settings` - Actualizar configuración

**Community (2)**
- GET `/api/events` - Eventos activos
- GET `/api/guilds` - Lista de guilds

**Shop (2)**
- GET `/api/shop/packages` - Paquetes disponibles
- GET `/api/shop/premium` - Estado premium

---

## 🔑 Autenticación

Los endpoints protegidos requieren token JWT:

```bash
# 1. Login
POST /api/auth/login
{
  "name": "usuario",
  "password": "contraseña"
}

# 2. Usar token en headers
Authorization: Bearer <tu_token>
```

---

## 💡 Tips

- **Python Script**: Mejor para testing completo
- **REST Client**: Mejor para desarrollo diario
- **Thunder Client**: Mejor si vienes de Postman
- **Bash Script**: Mejor para automatización

---

## 🐛 Troubleshooting

**Error de conexión:**
```bash
# Verificar que el servidor esté corriendo
curl http://localhost:8000/health
```

**Error 401 Unauthorized:**
- Verifica que el token sea válido
- Haz login nuevamente para obtener un token fresco

**Error 404:**
- Verifica que el endpoint esté bien escrito
- Revisa que el servidor esté en el puerto 8000
