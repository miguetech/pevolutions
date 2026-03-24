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
  electric: 'bg-[#38bdf8] text-gray-900',
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
    font-bold uppercase tracking-wider text-white
    ${typeStyles[type]}
    ${sizeStyles[size]}
    shadow-lg transition-transform hover:scale-105
  `}>
    {type}
  </span>
);
