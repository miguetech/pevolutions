import React from 'react';
import { usePlayerPokemon } from '../hooks/usePlayerPokemon';

interface Props {
  playerName: string;
}

export const PokemonTeam: React.FC<Props> = ({ playerName }) => {
  const { data, isLoading, isError } = usePlayerPokemon(playerName);

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎮 Pokemon Team</h3>
        <p className="text-gray-400">Loading team...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🎮 Pokemon Team</h3>
        <p className="text-red-400">Failed to load team</p>
      </div>
    );
  }

  const pokemonSlots = [
    data.pokemon1,
    data.pokemon2,
    data.pokemon3,
    data.pokemon4,
    data.pokemon5,
    data.pokemon6,
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">🎮 Pokemon Team</h3>
      <div className="grid grid-cols-3 gap-4">
        {pokemonSlots.map((pokemonId, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center aspect-square"
          >
            {pokemonId ? (
              <>
                <div className="text-4xl mb-2">🔴</div>
                <p className="text-sm font-semibold">#{pokemonId}</p>
              </>
            ) : (
              <div className="text-gray-500 text-2xl">⚪</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
