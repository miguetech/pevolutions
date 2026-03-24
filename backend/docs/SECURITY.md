# 🔐 Seguridad - PEvolutions API

Documentación completa del sistema de seguridad y autenticación.

> **Nota:** La documentación está organizada en módulos específicos en la carpeta **[security/](security/)**

---

## 📚 Documentación por Componente

### Componentes Técnicos
1. **[bcrypt.md](security/bcrypt.md)** - Hashing de contraseñas
2. **[jwt.md](security/jwt.md)** - JSON Web Tokens
3. **[validation.md](security/validation.md)** - Validación de tokens
4. **[authorization.md](security/authorization.md)** - Autorización y permisos

### Guías Prácticas
5. **[authentication-flow.md](security/authentication-flow.md)** - Flujo completo de autenticación
6. **[endpoint-security.md](security/endpoint-security.md)** - Niveles de seguridad por endpoint
7. **[configuration.md](security/configuration.md)** - Configuración y variables de entorno
8. **[best-practices.md](security/best-practices.md)** - Mejores prácticas y troubleshooting

---

## 🚀 Inicio Rápido

### Arquitectura de 4 Capas

```
1. CONTRASEÑAS (bcrypt)
   → Hash con salt automático
   → Nunca en texto plano

2. TOKENS (JWT)
   → Firmado con SECRET_KEY
   → Expira en 30 minutos

3. VALIDACIÓN (OAuth2)
   → Verifica firma y expiración
   → Busca usuario en BD

4. AUTORIZACIÓN (Permisos)
   → Verifica propiedad de recursos
   → 403 si no autorizado
```

---

## 📖 Rutas de Lectura

### Para Aprender
1. [security/README.md](security/README.md) - Índice completo
2. [authentication-flow.md](security/authentication-flow.md) - Visión general
3. [bcrypt.md](security/bcrypt.md) → [jwt.md](security/jwt.md) → [validation.md](security/validation.md)

### Para Implementar
1. [configuration.md](security/configuration.md) - Configurar variables
2. [endpoint-security.md](security/endpoint-security.md) - Proteger endpoints
3. [best-practices.md](security/best-practices.md) - Buenas prácticas

### Para Resolver Problemas
1. [best-practices.md](security/best-practices.md) - Troubleshooting
2. Archivo específico del componente con problemas

---

## 🎯 Niveles de Seguridad

### Nivel 0: Públicos (5 endpoints)
No requieren autenticación
- `GET /api/players/online`
- `GET /api/events`
- `GET /api/guilds`

### Nivel 1: Autenticados (10 endpoints)
Requieren token JWT válido
- `GET /api/players/` (mis jugadores)
- `POST /api/players/` (crear jugador)
- `GET /api/account/stats`

### Nivel 2: Autorizados (2 endpoints)
Requieren token + verificación de propiedad
- `PUT /api/players/{name}` (solo si es tuyo)
- `DELETE /api/players/{name}` (solo si es tuyo)

**Ver detalles:** [endpoint-security.md](security/endpoint-security.md)

---

## ⚙️ Configuración Rápida

```env
# .env
SECRET_KEY=<generar con: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Ver detalles:** [configuration.md](security/configuration.md)

---

## 🔄 Flujo Básico

```bash
# 1. Registro
POST /api/auth/register
{"name": "usuario", "password": "contraseña", "email": "email@example.com"}

# 2. Login
POST /api/auth/login
{"name": "usuario", "password": "contraseña"}
→ Retorna: {"access_token": "eyJhbGci...", "token_type": "bearer"}

# 3. Request protegido
GET /api/players/
Authorization: Bearer eyJhbGci...
```

**Ver detalles:** [authentication-flow.md](security/authentication-flow.md)

---

## 🔑 Conceptos Clave

- **Autenticación**: ¿Quién eres? (Login con usuario/contraseña)
- **Autorización**: ¿Qué puedes hacer? (Permisos sobre recursos)
- **Token JWT**: Credencial temporal que identifica al usuario
- **Hash bcrypt**: Contraseña encriptada de forma irreversible

---

## 📁 Estructura de Archivos

```
docs/security/
├── README.md                    Índice de la carpeta
├── bcrypt.md                    Hashing de contraseñas
├── jwt.md                       JSON Web Tokens
├── validation.md                Validación de tokens
├── authorization.md             Autorización y permisos
├── authentication-flow.md       Flujo completo
├── endpoint-security.md         Seguridad por endpoint
├── configuration.md             Configuración
└── best-practices.md            Mejores prácticas
```

---

## 🔗 Enlaces Útiles

- **Índice de documentación:** [docs/README.md](README.md)
- **Carpeta de seguridad:** [security/](security/)
- **API Endpoints:** [API_ENDPOINTS.md](API_ENDPOINTS.md)
- **Guía de pruebas:** [../tests/TESTING_GUIDE.md](../tests/TESTING_GUIDE.md)
