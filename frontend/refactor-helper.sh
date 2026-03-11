#!/bin/bash

# Script helper para refactorización de arquitectura
# Uso: ./refactor-helper.sh [fase]

set -e

FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$FRONTEND_DIR"

echo "🚀 Refactor Helper - Pevolutions Frontend"
echo "=========================================="

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para crear directorios
create_dirs() {
    echo -e "${BLUE}📁 Creando estructura de directorios...${NC}"
    
    # Apps
    mkdir -p src/apps/public/{features/{home,downloads,community,support}/components,layouts}
    mkdir -p src/apps/user/{features/{account,players,profile}/{components,hooks,api},layouts}
    mkdir -p src/apps/admin/{features/{dashboard,users,players,logs,settings}/{components,hooks,api},layouts}
    
    # Auth
    mkdir -p src/auth/{components,hooks,stores,api,types,utils,layouts}
    mkdir -p src/auth/{components,hooks,stores}/__tests__
    
    # Shared
    mkdir -p src/shared/{components/{ui,forms,navigation,feedback},hooks,stores,lib,types,utils}
    
    echo -e "${GREEN}✅ Estructura de directorios creada${NC}"
}

# Función para crear archivos base de auth
create_auth_base() {
    echo -e "${BLUE}🔐 Creando archivos base de autenticación...${NC}"
    
    # Types
    cat > src/auth/types/user.ts << 'EOF'
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}
EOF

    cat > src/auth/types/auth.ts << 'EOF'
import type { User } from './user';

export interface LoginCredentials {
  name: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
EOF

    # Utils - RBAC
    cat > src/auth/utils/rbac.ts << 'EOF'
import { Role } from '../types/user';

export const permissions = {
  [Role.USER]: [
    'account:read',
    'account:update',
    'players:read',
    'players:create',
  ],
  [Role.ADMIN]: [
    'account:read',
    'account:update',
    'players:*',
    'users:read',
    'users:update',
    'users:delete',
    'logs:read',
  ],
  [Role.SUPER_ADMIN]: ['*'],
};

export function hasPermission(role: Role, permission: string): boolean {
  const rolePerms = permissions[role];
  if (!rolePerms) return false;
  
  if (rolePerms.includes('*')) return true;
  
  // Check exact permission
  if (rolePerms.includes(permission)) return true;
  
  // Check wildcard permissions (e.g., 'players:*')
  const [resource] = permission.split(':');
  return rolePerms.includes(`${resource}:*`);
}
EOF

    echo -e "${GREEN}✅ Archivos base de auth creados${NC}"
}

# Función para actualizar tsconfig
update_tsconfig() {
    echo -e "${BLUE}⚙️  Actualizando tsconfig.json...${NC}"
    
    # Backup
    cp tsconfig.json tsconfig.json.backup
    
    # Actualizar paths (esto es un ejemplo, ajustar según necesidad)
    cat > tsconfig.json << 'EOF'
{
  "extends": "astro/tsconfigs/strict",
  "include": [
    ".astro/types.d.ts",
    "**/*"
  ],
  "exclude": [
    "dist"
  ],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/auth/*": ["./src/auth/*"],
      "@/apps/*": ["./src/apps/*"],
      "@/shared/*": ["./src/shared/*"]
    }
  }
}
EOF
    
    echo -e "${GREEN}✅ tsconfig.json actualizado (backup en tsconfig.json.backup)${NC}"
}

# Función para crear README de la nueva estructura
create_structure_readme() {
    echo -e "${BLUE}📝 Creando documentación de estructura...${NC}"
    
    cat > ARCHITECTURE.md << 'EOF'
# Arquitectura Frontend - Pevolutions

## 📁 Estructura de Directorios

```
src/
├── apps/               # Aplicaciones por rol
│   ├── public/        # App pública
│   ├── user/          # App de usuario autenticado
│   └── admin/         # App de administración
├── auth/              # Dominio de autenticación
├── shared/            # Código compartido
└── pages/             # Páginas de Astro
```

## 🎯 Convenciones de Imports

```typescript
// Autenticación
import { useAuth } from '@/auth/hooks/useAuth';
import { LoginForm } from '@/auth/components/LoginForm';

// Features de usuario
import { Account } from '@/apps/user/features/account/Account';

// Features de admin
import { Dashboard } from '@/apps/admin/features/dashboard/Dashboard';

// Componentes compartidos
import { Button } from '@/shared/components/ui/Button';
```

## 🔐 Sistema de Permisos

Ver `src/auth/utils/rbac.ts` para la configuración de permisos por rol.

## 📚 Recursos

- [TDD de Refactorización](./REFACTOR_TDD.md)
- [Documentación de Astro](https://docs.astro.build)
EOF
    
    echo -e "${GREEN}✅ ARCHITECTURE.md creado${NC}"
}

# Menú principal
case "${1:-menu}" in
    "fase1"|"1")
        echo -e "${YELLOW}Ejecutando Fase 1: Preparación y Configuración${NC}"
        create_dirs
        update_tsconfig
        create_structure_readme
        echo -e "${GREEN}✅ Fase 1 completada${NC}"
        ;;
    
    "fase2"|"2")
        echo -e "${YELLOW}Ejecutando Fase 2: Migrar Dominio de Autenticación${NC}"
        create_auth_base
        echo -e "${GREEN}✅ Fase 2 (base) completada${NC}"
        echo -e "${YELLOW}⚠️  Ahora debes migrar manualmente los componentes de auth${NC}"
        ;;
    
    "test")
        echo -e "${BLUE}🧪 Ejecutando tests...${NC}"
        npm run test
        ;;
    
    "build")
        echo -e "${BLUE}🏗️  Building...${NC}"
        npm run build
        ;;
    
    "clean")
        echo -e "${YELLOW}🧹 Limpiando archivos antiguos...${NC}"
        echo "Esta operación eliminará directorios antiguos."
        read -p "¿Estás seguro? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf src/components src/hooks src/stores 2>/dev/null || true
            echo -e "${GREEN}✅ Limpieza completada${NC}"
        else
            echo "Operación cancelada"
        fi
        ;;
    
    *)
        echo ""
        echo "Uso: ./refactor-helper.sh [comando]"
        echo ""
        echo "Comandos disponibles:"
        echo "  fase1, 1     - Crear estructura de directorios y configuración"
        echo "  fase2, 2     - Crear archivos base de autenticación"
        echo "  test         - Ejecutar tests"
        echo "  build        - Build de producción"
        echo "  clean        - Limpiar archivos antiguos (¡CUIDADO!)"
        echo ""
        echo "Ejemplo: ./refactor-helper.sh fase1"
        ;;
esac
