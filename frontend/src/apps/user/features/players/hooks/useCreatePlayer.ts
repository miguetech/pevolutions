import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playersAPI } from '../api/playersAPI';

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playersAPI.createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
    },
  });
}
