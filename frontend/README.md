# PEvolutions Frontend

Frontend del juego PEvolutions - Interfaz web construida con Astro + React.

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
cd frontend
npm install

# 2. Iniciar servidor de desarrollo
npm run dev
```

**Servidor:** http://localhost:4321

---

## 📚 Documentación Completa

Ver **[docs/README.md](docs/README.md)** para documentación completa:
- 🏗️ Arquitectura del sistema
- 👨‍💻 Guías de desarrollo
- 🧪 Testing y refactorización

---

## 🛠️ Tecnologías

- **Astro** - Framework web con SSR
- **React** - Componentes interactivos
- **Jotai** - Estado global
- **TanStack Query** - Fetching y caché de datos
- **Ky** - Cliente HTTP
- **TypeScript** - Tipado estático
- **Vitest** - Testing

---

## 🧞 Comandos

| Comando | Acción |
|---|---|
| `npm install` | Instala dependencias |
| `npm run dev` | Servidor dev en `localhost:4321` |
| `npm run build` | Build de producción en `./dist/` |
| `npm run preview` | Preview del build |
| `npm run test` | Ejecutar tests |

---

## 📁 Estructura

```
src/
├── apps/               # Aplicaciones por rol
│   ├── public/         # App pública
│   ├── user/           # App de usuario autenticado
│   └── admin/          # App de administración
├── auth/               # Dominio de autenticación
├── shared/             # Código compartido
└── pages/              # Páginas de Astro
```

---

## 🔧 Configuración

Asegúrate de que el backend esté corriendo en `http://localhost:8000`.

Ver **[docs/development/TESTING_WITHOUT_BACKEND.md](docs/development/TESTING_WITHOUT_BACKEND.md)** para trabajar sin backend.

---

## 📝 Licencia

Proyecto privado - PEvolutions
