import { useQuery } from '@tanstack/react-query';
import { playersAPI } from '../api/playersAPI';

export function usePlayersList() {
  return useQuery({
    queryKey: ['players', 'list'],
    queryFn: playersAPI.getPlayers,
    staleTime: 1000 * 60,
  });
}
