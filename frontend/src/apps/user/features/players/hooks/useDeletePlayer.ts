import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playersAPI } from '../api/playersAPI';

export function useDeletePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => playersAPI.deletePlayer(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
    },
  });
}
