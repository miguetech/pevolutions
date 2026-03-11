import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playersAPI } from '../api/playersAPI';
import { HTTPError } from 'ky';

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playersAPI.createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
    },
    onError: async (error) => {
      if (error instanceof HTTPError) {
        const body = await error.response.json();
        throw new Error(body.detail || 'Failed to create player');
      }
    },
  });
}
