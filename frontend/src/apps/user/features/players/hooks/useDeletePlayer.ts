import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playersAPI } from '../api/playersAPI';
import { HTTPError } from 'ky';

export function useDeletePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      try {
        return await playersAPI.deletePlayer(name);
      } catch (error) {
        if (error instanceof HTTPError) {
          const body = await error.response.json();
          throw new Error(body.detail || 'Failed to delete player');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
    },
  });
}
