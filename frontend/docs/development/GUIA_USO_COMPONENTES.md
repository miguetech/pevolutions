# 🎨 Guía de Uso - Nuevos Componentes UI

## TypeBadge

### Uso Básico
```tsx
import { TypeBadge } from '@/shared/components/ui/TypeBadge';

// En tu componente
<TypeBadge type="electric" />
<TypeBadge type="fire" size="lg" />
<TypeBadge type="water" size="sm" />
```

### Ejemplo en Perfil de Pokémon
```tsx
const PokemonCard = ({ pokemon }) => (
  <div className="glass-card p-4">
    <h3>{pokemon.name}</h3>
    <div className="flex gap-2 mt-2">
      <TypeBadge type={pokemon.type1} />
      {pokemon.type2 && <TypeBadge type={pokemon.type2} />}
    </div>
  </div>
);
```

### Tipos Disponibles
- `normal`, `fire`, `water`, `electric`, `grass`, `ice`
- `fighting`, `poison`, `ground`, `flying`, `psychic`, `bug`
- `rock`, `ghost`, `dragon`, `dark`, `steel`, `fairy`

---

## PokéballLoader

### Uso Básico
```tsx
import { PokéballLoader } from '@/shared/components/ui/PokéballLoader';

// Durante carga
{isLoading && <PokéballLoader />}
```

### Ejemplo en Página
```tsx
const PlayersPage = () => {
  const { data, isLoading } = useQuery(...);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <PokéballLoader />
          <p className="mt-4 text-gray-400">Loading players...</p>
        </div>
      </div>
    );
  }
  
  return <PlayersList players={data} />;
};
```

---

## Skeleton Screens

### PlayerCardSkeleton
```tsx
import { PlayerCardSkeleton } from '@/shared/components/ui/Skeleton';

// En lista de jugadores
{isLoading ? (
  <div className="space-y-4">
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
    <PlayerCardSkeleton />
  </div>
) : (
  <PlayersList players={data} />
)}
```

### TableSkeleton
```tsx
import { TableSkeleton } from '@/shared/components/ui/Skeleton';

// En tabla de rankings
{isLoading ? (
  <TableSkeleton rows={10} />
) : (
  <RankingsTable data={data} />
)}
```

### StatCardSkeleton
```tsx
import { StatCardSkeleton } from '@/shared/components/ui/Skeleton';

// En dashboard
{isLoading ? (
  <div className="grid grid-cols-3 gap-4">
    <StatCardSkeleton />
    <StatCardSkeleton />
    <StatCardSkeleton />
  </div>
) : (
  <StatsGrid stats={data} />
)}
```

---

## Nuevos Estilos de Botones

### btn-primary (Electric)
```tsx
<button className="btn-primary">
  ⚡ Play Now
</button>
```

### btn-secondary (Water)
```tsx
<button className="btn-secondary">
  📥 Download
</button>
```

### btn-danger (Fire)
```tsx
<button className="btn-danger">
  🗑️ Delete
</button>
```

### Ejemplo Completo
```tsx
const ActionButtons = () => (
  <div className="flex gap-4">
    <button className="btn-primary">
      Start Game
    </button>
    <button className="btn-secondary">
      View Profile
    </button>
    <button className="btn-danger">
      Logout
    </button>
  </div>
);
```

---

## Glass Card Mejorado

### Uso
```tsx
<div className="glass-card p-6">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  <p className="text-gray-400">Content with improved glassmorphism</p>
</div>
```

### Con Hover Effect
```tsx
<div className="glass-card p-6 hover:scale-105 transition-transform cursor-pointer">
  <h3>Interactive Card</h3>
</div>
```

---

## Combinando Componentes

### Card de Pokémon Completo
```tsx
const PokemonCard = ({ pokemon, isLoading }) => {
  if (isLoading) {
    return <PlayerCardSkeleton />;
  }
  
  return (
    <div className="glass-card p-6 hover:scale-105 transition-transform">
      <div className="flex items-center gap-4 mb-4">
        <img src={pokemon.sprite} alt={pokemon.name} className="w-16 h-16" />
        <div>
          <h3 className="text-xl font-bold">{pokemon.name}</h3>
          <div className="flex gap-2 mt-1">
            <TypeBadge type={pokemon.type1} size="sm" />
            {pokemon.type2 && <TypeBadge type={pokemon.type2} size="sm" />}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Level</span>
          <span className="font-bold">{pokemon.level}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">HP</span>
          <span className="font-bold">{pokemon.hp}</span>
        </div>
      </div>
      
      <button className="btn-primary w-full mt-4">
        View Details
      </button>
    </div>
  );
};
```

### Lista con Loading States
```tsx
const PlayersList = () => {
  const { data: players, isLoading } = usePlayers();
  
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold mb-6">Online Players</h2>
      
      {isLoading ? (
        <>
          <PlayerCardSkeleton />
          <PlayerCardSkeleton />
          <PlayerCardSkeleton />
        </>
      ) : players.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <PokéballLoader />
          <p className="text-gray-400 mt-4">No players online</p>
        </div>
      ) : (
        players.map(player => (
          <div key={player.id} className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">{player.name}</h3>
                <p className="text-sm text-gray-400">Level {player.level}</p>
              </div>
              <button className="btn-secondary">
                View Profile
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
```

---

## Tips de Uso

### 1. Consistencia
Usa siempre los mismos componentes para estados similares:
- Loading → Skeleton o PokéballLoader
- Tipos → TypeBadge
- Acciones → btn-primary/secondary/danger

### 2. Performance
Los skeletons mejoran la perceived performance:
```tsx
// ✅ Bueno
{isLoading ? <PlayerCardSkeleton /> : <PlayerCard />}

// ❌ Malo
{isLoading ? <p>Loading...</p> : <PlayerCard />}
```

### 3. Accesibilidad
Agrega aria-labels cuando sea necesario:
```tsx
<PokéballLoader aria-label="Loading players" />
```

### 4. Responsive
Los componentes son responsive por defecto:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {pokemon.map(p => <PokemonCard key={p.id} pokemon={p} />)}
</div>
```

---

## Migración de Código Existente

### Antes
```tsx
{isLoading && <p>Loading...</p>}
<span className="bg-blue-500 px-2 py-1 rounded">Fire</span>
<button className="bg-yellow-500 px-4 py-2 rounded">Click</button>
```

### Después
```tsx
{isLoading && <PlayerCardSkeleton />}
<TypeBadge type="fire" />
<button className="btn-primary">Click</button>
```

---

## Troubleshooting

### TypeBadge no se ve
- Verifica que el tipo sea válido
- Revisa que global.css esté importado

### PokéballLoader no anima
- Verifica que las animaciones CSS estén en global.css
- Revisa la consola por errores

### Skeleton no aparece
- Verifica el import correcto
- Asegúrate que isLoading sea true

---

**Última actualización:** 13 de Marzo, 2026
