import { useQuery } from '@tanstack/react-query';
import { playersAPI } from '../api/playersAPI';

export function usePlayerStats(name: string) {
  return useQuery({
    queryKey: ['player', name, 'stats'],
    queryFn: () => playersAPI.getPlayerStats(name),
    enabled: !!name,
    staleTime: 1000 * 60,
  });
}
