# 🔐 Seguridad - PEvolutions API

Documentación completa del sistema de seguridad y autenticación.

---

## 📚 Contenido

### Componentes
1. **[bcrypt.md](bcrypt.md)** - Hashing de contraseñas
2. **[jwt.md](jwt.md)** - JSON Web Tokens
3. **[validation.md](validation.md)** - Validación de tokens
4. **[authorization.md](authorization.md)** - Autorización y permisos

### Guías
5. **[authentication-flow.md](authentication-flow.md)** - Flujo completo de autenticación
6. **[endpoint-security.md](endpoint-security.md)** - Niveles de seguridad por endpoint
7. **[configuration.md](configuration.md)** - Configuración y variables de entorno
8. **[best-practices.md](best-practices.md)** - Mejores prácticas y troubleshooting

---

## 🚀 Inicio Rápido

### Arquitectura de 4 Capas

```
┌─────────────────────────────────────┐
│ 1. CONTRASEÑAS (bcrypt)             │
│    → Hash con salt automático       │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 2. TOKENS (JWT)                     │
│    → Firmado con SECRET_KEY         │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 3. VALIDACIÓN (OAuth2)              │
│    → Verifica firma y expiración    │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 4. AUTORIZACIÓN (Permisos)          │
│    → Verifica propiedad de recursos │
└─────────────────────────────────────┘
```

---

## 📖 Lectura Recomendada

**Para entender el sistema:**
1. [authentication-flow.md](authentication-flow.md) - Flujo general
2. [bcrypt.md](bcrypt.md) - Contraseñas
3. [jwt.md](jwt.md) - Tokens

**Para implementar:**
1. [endpoint-security.md](endpoint-security.md) - Proteger endpoints
2. [configuration.md](configuration.md) - Configurar
3. [best-practices.md](best-practices.md) - Buenas prácticas

---

## 🔑 Conceptos Clave

- **Autenticación**: ¿Quién eres? (Login con usuario/contraseña)
- **Autorización**: ¿Qué puedes hacer? (Permisos sobre recursos)
- **Token JWT**: Credencial temporal que identifica al usuario
- **Hash bcrypt**: Contraseña encriptada de forma irreversible
