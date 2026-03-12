import { useQuery } from '@tanstack/react-query';
import { playersAPI } from '../api/playersAPI';

export function usePlayerPokemon(name: string) {
  return useQuery({
    queryKey: ['player', name, 'pokemon'],
    queryFn: () => playersAPI.getPlayerPokemon(name),
    enabled: !!name,
    staleTime: 1000 * 60,
  });
}
