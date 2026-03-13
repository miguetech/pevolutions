# 🚀 Plan de Acción Inmediato - Frontend PEvolutions

**Fecha inicio:** 13 de Marzo, 2026  
**Duración:** 2 semanas (Sprint 1)  
**Objetivo:** Transformar la identidad visual del proyecto

---

## 📅 SEMANA 1: Rediseño Visual Base

### Día 1-2: Nueva Paleta de Colores

#### Tarea 1: Actualizar Variables CSS (2 horas)

**Archivo:** `frontend/src/styles/global.css`

```css
@theme {
  /* ❌ ELIMINAR colores genéricos actuales */
  
  /* ✅ NUEVA PALETA POKÉMON */
  
  /* Colores Principales */
  --color-electric: #F7D02C;      /* Pikachu - Acento principal */
  --color-fire: #FF6B2C;          /* Charmander - Alertas/CTA */
  --color-water: #4A90E2;         /* Squirtle - Links/Info */
  --color-grass: #78C850;         /* Bulbasaur - Success */
  --color-psychic: #F85888;       /* Mew - Premium/Special */
  
  /* Backgrounds */
  --color-dark-primary: #0F1419;  /* Fondo principal */
  --color-dark-secondary: #1A1F2E; /* Cards */
  --color-dark-tertiary: #252B3B;  /* Hover states */
  
  /* Tipos Pokémon (para badges) */
  --type-normal: #A8A878;
  --type-fighting: #C03028;
  --type-flying: #A890F0;
  --type-poison: #A040A0;
  --type-ground: #E0C068;
  --type-rock: #B8A038;
  --type-bug: #A8B820;
  --type-ghost: #705898;
  --type-steel: #B8B8D0;
  --type-dragon: #7038F8;
  --type-dark: #705848;
  --type-fairy: #EE99AC;
  --type-ice: #98D8D8;
  
  /* Glassmorphism mejorado */
  --glass-bg: rgba(26, 31, 46, 0.85);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-blur: 20px;
  
  /* Sombras */
  --shadow-electric: 0 8px 32px rgba(247, 208, 44, 0.25);
  --shadow-fire: 0 8px 32px rgba(255, 107, 44, 0.25);
  --shadow-water: 0 8px 32px rgba(74, 144, 226, 0.25);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
}

/* Actualizar clases base */
@layer base {
  html, body {
    @apply h-full w-full text-white overflow-x-hidden;
    background: var(--color-dark-primary);
    font-family: 'Inter', system-ui, sans-serif;
  }

  body {
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(247, 208, 44, 0.08) 0%, transparent 25%),
      radial-gradient(circle at 80% 80%, rgba(74, 144, 226, 0.08) 0%, transparent 25%),
      radial-gradient(circle at 50% 50%, rgba(255, 107, 44, 0.05) 0%, transparent 40%);
    background-attachment: fixed;
  }
}

@layer components {
  /* Glass Card mejorado */
  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(180%);
    border: 1px solid var(--glass-border);
    box-shadow: 
      var(--shadow-card),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
    @apply rounded-xl;
  }

  /* Botones actualizados */
  .btn-primary {
    background: linear-gradient(135deg, var(--color-electric) 0%, #E5C028 100%);
    @apply text-gray-900 font-bold py-3 px-6 rounded-lg transition-all duration-300;
    box-shadow: var(--shadow-electric);
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(247, 208, 44, 0.35);
  }
  
  .btn-secondary {
    background: linear-gradient(135deg, var(--color-water) 0%, #3A7BC8 100%);
    @apply text-white font-bold py-3 px-6 rounded-lg transition-all duration-300;
    box-shadow: var(--shadow-water);
  }
  
  .btn-danger {
    background: linear-gradient(135deg, var(--color-fire) 0%, #E55A1C 100%);
    @apply text-white font-bold py-3 px-6 rounded-lg transition-all duration-300;
    box-shadow: var(--shadow-fire);
  }

  /* Nav link actualizado */
  .nav-link {
    @apply text-gray-400 hover:text-electric transition-colors duration-200;
  }
}
```

#### Tarea 2: Crear Componente TypeBadge (1 hora)

**Archivo:** `frontend/src/shared/components/ui/TypeBadge.tsx`

```tsx
import React from 'react';

type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md' | 'lg';
}

const typeStyles: Record<PokemonType, string> = {
  normal: 'bg-[#A8A878]',
  fire: 'bg-[#FF6B2C]',
  water: 'bg-[#4A90E2]',
  electric: 'bg-[#F7D02C] text-gray-900',
  grass: 'bg-[#78C850]',
  ice: 'bg-[#98D8D8]',
  fighting: 'bg-[#C03028]',
  poison: 'bg-[#A040A0]',
  ground: 'bg-[#E0C068]',
  flying: 'bg-[#A890F0]',
  psychic: 'bg-[#F85888]',
  bug: 'bg-[#A8B820]',
  rock: 'bg-[#B8A038]',
  ghost: 'bg-[#705898]',
  dragon: 'bg-[#7038F8]',
  dark: 'bg-[#705848]',
  steel: 'bg-[#B8B8D0]',
  fairy: 'bg-[#EE99AC]',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'md' }) => (
  <span className={`
    inline-flex items-center justify-center rounded-full
    font-bold uppercase tracking-wider
    ${typeStyles[type]}
    ${sizeStyles[size]}
    shadow-lg transition-transform hover:scale-105
  `}>
    {type}
  </span>
);
```

#### Tarea 3: Crear PokéballLoader (2 horas)

**Archivo:** `frontend/src/shared/components/ui/PokéballLoader.tsx`

```tsx
import React from 'react';

export const PokéballLoader: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="pokeball-loader">
      <div className="pokeball">
        <div className="pokeball-top"></div>
        <div className="pokeball-bottom"></div>
        <div className="pokeball-center">
          <div className="pokeball-button"></div>
        </div>
      </div>
    </div>
  </div>
);
```

**Archivo:** `frontend/src/styles/global.css` (agregar al final)

```css
/* Pokéball Loader Animation */
.pokeball-loader {
  @apply relative w-16 h-16;
}

.pokeball {
  @apply relative w-full h-full;
  animation: spin-pokeball 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.pokeball-top {
  @apply absolute top-0 left-0 w-full h-1/2 rounded-t-full;
  background: linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%);
  border-bottom: 3px solid #1A1F2E;
}

.pokeball-bottom {
  @apply absolute bottom-0 left-0 w-full h-1/2 rounded-b-full;
  background: linear-gradient(135deg, #F8F9FA 0%, #DEE2E6 100%);
  border-top: 3px solid #1A1F2E;
}

.pokeball-center {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  @apply w-6 h-6 rounded-full bg-white;
  border: 3px solid #1A1F2E;
  box-shadow: 0 0 0 2px white, 0 0 10px rgba(0, 0, 0, 0.3);
}

.pokeball-button {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  @apply w-3 h-3 rounded-full bg-gray-800;
  border: 2px solid white;
  animation: pulse-button 1.5s ease-in-out infinite;
}

@keyframes spin-pokeball {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(360deg); }
}

@keyframes pulse-button {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}
```

---

### Día 3-4: Skeleton Screens (6 horas)

#### Crear Componentes de Loading

**Archivo:** `frontend/src/shared/components/ui/Skeleton.tsx`

```tsx
import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-white/10 rounded ${className}`} />
);

export const PlayerCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="glass-card p-6 space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="glass-card p-6 space-y-3">
    <Skeleton className="h-6 w-32" />
    <Skeleton className="h-10 w-20" />
    <Skeleton className="h-3 w-full" />
  </div>
);
```

#### Actualizar Componentes para Usar Skeletons

**Ejemplo:** `frontend/src/apps/user/features/players/components/OnlinePlayers.tsx`

```tsx
import { PlayerCardSkeleton } from '@/shared/components/ui/Skeleton';

// Dentro del componente:
if (isLoading) {
  return (
    <div className="space-y-4">
      <PlayerCardSkeleton />
      <PlayerCardSkeleton />
      <PlayerCardSkeleton />
    </div>
  );
}
```

---

### Día 5: Mejorar Hero Section (4 horas)

**Archivo:** `frontend/src/apps/public/features/home/components/Hero.tsx`

```tsx
import React from 'react';
import { useTranslations } from '@/i18n/utils';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

const Hero: React.FC<Props> = ({ lang }) => {
  const t = useTranslations(lang);

  return (
    <div className="glass-card overflow-hidden relative">
      {/* Background con gradiente mejorado */}
      <div className="relative h-[500px] bg-gradient-to-br from-electric/20 via-water/10 to-fire/20 flex items-center justify-center overflow-hidden">
        
        {/* Pokéballs decorativas flotantes */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="pokeball-float" style={{ top: '10%', left: '10%', animationDelay: '0s' }}>⚪</div>
          <div className="pokeball-float" style={{ top: '60%', left: '80%', animationDelay: '1s' }}>⚪</div>
          <div className="pokeball-float" style={{ top: '80%', left: '20%', animationDelay: '2s' }}>⚪</div>
        </div>

        {/* Contenido principal */}
        <div className="relative z-10 text-center px-6 space-y-6">
          <div className="inline-block">
            <h1 className="text-7xl font-black uppercase tracking-tighter text-white drop-shadow-2xl">
              P<span className="text-electric">E</span>volutions
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 bg-fire/80 text-white text-xs font-bold uppercase rounded-full">
                Beta
              </span>
              <span className="px-3 py-1 bg-grass/80 text-white text-xs font-bold uppercase rounded-full">
                Online
              </span>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('hero.tagline')}
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button className="btn-primary">
              🎮 {t('hero.play_now')}
            </button>
            <button className="btn-secondary">
              📥 {t('hero.download')}
            </button>
          </div>
        </div>

        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-transparent to-transparent"></div>
      </div>

      {/* Sección de features */}
      <div className="p-8 space-y-6">
        <h2 className="text-3xl font-bold text-white">{t('hero.welcome')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FeatureCard 
            icon="🗺️"
            title={t('hero.feature_1_title')}
            description={t('hero.feature_1_desc')}
          />
          <FeatureCard 
            icon="⚔️"
            title={t('hero.feature_2_title')}
            description={t('hero.feature_2_desc')}
          />
          <FeatureCard 
            icon="👥"
            title={t('hero.feature_3_title')}
            description={t('hero.feature_3_desc')}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = 
  ({ icon, title, description }) => (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );

export default Hero;
```

**CSS adicional:**

```css
@keyframes float-pokeball {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.pokeball-float {
  @apply absolute text-6xl;
  animation: float-pokeball 6s ease-in-out infinite;
}
```

---

## 📅 SEMANA 2: Animaciones y Polish

### Día 6-7: Instalar y Configurar Framer Motion (8 horas)

#### Instalación

```bash
cd frontend
npm install framer-motion
```

#### Crear Wrapper de Animaciones

**Archivo:** `frontend/src/shared/components/animations/AnimatedPage.tsx`

```tsx
import { motion } from 'framer-motion';
import React from 'react';

export const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = 
  ({ children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );

export const SlideIn: React.FC<{ children: React.ReactNode; direction?: 'left' | 'right' | 'up' | 'down' }> = 
  ({ children, direction = 'up' }) => {
    const directions = {
      left: { x: -50, y: 0 },
      right: { x: 50, y: 0 },
      up: { x: 0, y: 50 },
      down: { x: 0, y: -50 },
    };

    return (
      <motion.div
        initial={{ opacity: 0, ...directions[direction] }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    );
  };

export const ScaleIn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);
```

#### Animar Cards

**Archivo:** `frontend/src/shared/components/ui/AnimatedCard.tsx`

```tsx
import { motion } from 'framer-motion';
import React from 'react';

export const AnimatedCard: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -8, transition: { duration: 0.2 } }}
    className={`glass-card ${className}`}
  >
    {children}
  </motion.div>
);
```

### Día 8-9: Animar Componentes Principales (10 horas)

#### Actualizar Navbar con animaciones

```tsx
// En AuthenticatedNavbar.tsx
import { motion, AnimatePresence } from 'framer-motion';

// Mobile menu con animación
<AnimatePresence>
  {isMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="lg:hidden py-4 border-t border-white/5"
    >
      {/* contenido del menú */}
    </motion.div>
  )}
</AnimatePresence>
```

#### Animar listas con stagger

```tsx
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// En PlayersList.tsx
<motion.div
  variants={container}
  initial="hidden"
  animate="show"
  className="space-y-4"
>
  {players.map((player) => (
    <motion.div key={player.id} variants={item}>
      <PlayerCard player={player} />
    </motion.div>
  ))}
</motion.div>
```

### Día 10: Testing y Ajustes (6 horas)

- Probar en diferentes navegadores
- Ajustar timings de animaciones
- Optimizar performance
- Verificar responsive design
- Documentar cambios

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Semana 1
- [ ] Actualizar paleta de colores en global.css
- [ ] Crear componente TypeBadge
- [ ] Crear PokéballLoader
- [ ] Implementar Skeleton screens
- [ ] Actualizar Hero section
- [ ] Probar en mobile y desktop

### Semana 2
- [ ] Instalar Framer Motion
- [ ] Crear wrappers de animación
- [ ] Animar page transitions
- [ ] Animar cards y listas
- [ ] Animar navbar mobile
- [ ] Testing final

---

## 📊 MÉTRICAS DE ÉXITO

Al final de las 2 semanas deberías tener:

- ✅ Nueva identidad visual implementada
- ✅ 5+ componentes UI nuevos
- ✅ Animaciones en 80% de componentes interactivos
- ✅ Loading states profesionales
- ✅ Hero section impactante
- ✅ Experiencia visual memorable

**Impacto esperado:** Diseño pasa de 5/10 a 7.5/10

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema: Animaciones lentas en mobile
**Solución:** Reducir blur y usar `will-change: transform`

### Problema: Colores no se actualizan
**Solución:** Limpiar cache del navegador y rebuild

### Problema: Framer Motion aumenta bundle size
**Solución:** Usar lazy loading para páginas con muchas animaciones

---

**Próximo paso:** Comenzar con Día 1 - Actualizar paleta de colores
