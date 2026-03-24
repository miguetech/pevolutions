import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playersAPI } from '../api/playersAPI';
import { HTTPError } from 'ky';

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; sex: number }) => {
      try {
        return await playersAPI.createPlayer(data);
      } catch (error) {
        if (error instanceof HTTPError) {
          const body = await error.response.json();
          throw new Error(body.detail || 'Failed to create player');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', 'list'] });
    },
  });
}
