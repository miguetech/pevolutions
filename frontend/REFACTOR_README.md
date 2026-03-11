# 📚 Documentación de Refactorización

## 🎯 Objetivo

Migrar la arquitectura actual del frontend a una estructura escalable que soporte múltiples roles (usuario y admin) con separación clara de responsabilidades.

## 📁 Archivos de Documentación

### 1. **REFACTOR_TDD.md** (14 KB) - Plan Detallado
Documento completo con todas las fases, tareas específicas y código de ejemplo.

**Cuándo usar:** Para entender el plan completo y ver ejemplos de código.

### 2. **REFACTOR_QUICKSTART.md** (6.6 KB) - Guía Paso a Paso
Guía práctica con comandos específicos y troubleshooting.

**Cuándo usar:** Durante la ejecución de la refactorización.

### 3. **REFACTOR_CHECKLIST.md** (2.3 KB) - Checklist Rápido
Lista compacta para marcar progreso.

**Cuándo usar:** Para seguimiento diario del avance.

### 4. **refactor-helper.sh** (6.6 KB) - Script de Automatización
Script bash para automatizar tareas repetitivas.

**Cuándo usar:** Para crear estructura y archivos base automáticamente.

## 🚀 Inicio Rápido

### Paso 1: Preparación
```bash
# Crear rama
git checkout -b feature/refactor-architecture

# Backup
cp -r src src.backup

# Verificar tests
npm run test
```

### Paso 2: Ejecutar Fase 1
```bash
# Crear estructura base
./refactor-helper.sh fase1
```

### Paso 3: Seguir el Plan
Abre `REFACTOR_QUICKSTART.md` y sigue las instrucciones fase por fase.

## 📊 Estructura Final

```
src/
├── apps/
│   ├── public/          # App pública (sin auth)
│   ├── user/            # App de usuario autenticado
│   └── admin/           # App de administración
├── auth/                # Dominio de autenticación aislado
├── shared/              # Código compartido
└── pages/               # Páginas de Astro
```

## 🎯 Beneficios

✅ **Escalabilidad** - Fácil agregar nuevos roles o features
✅ **Mantenibilidad** - Código organizado por dominio
✅ **Separación de responsabilidades** - Auth aislado
✅ **Reutilización** - Componentes compartidos centralizados
✅ **Seguridad** - Protección de rutas por rol

## ⏱️ Tiempo Estimado

- **Total:** 8-10 horas
- **Por fase:** 30 min - 1.5 horas

## 📞 Soporte

Si tienes dudas durante la refactorización:

1. Revisa `REFACTOR_QUICKSTART.md` sección "Troubleshooting"
2. Verifica que los tests pasen: `npm run test`
3. Revisa el TDD completo en `REFACTOR_TDD.md`

## 🔗 Recursos Adicionales

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Astro Documentation](https://docs.astro.build)
- [TanStack Query](https://tanstack.com/query/latest)
- [Jotai](https://jotai.org/)

---

**Creado:** 2026-03-10
**Versión:** 1.0
