import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playersAPI } from '@/shared/lib/api';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '@/auth/stores/authAtoms';

export function usePlayers() {
  const token = useAtomValue(tokenAtom);

  return useQuery({
    queryKey: ['players'],
    queryFn: playersAPI.getAll,
    enabled: !!token,
  });
}

export function useOnlinePlayers(params?: { limit?: number; sort_by?: string; search?: string }) {
  return useQuery({
    queryKey: ['players', 'online', params],
    queryFn: () => playersAPI.getOnline(params),
    refetchInterval: 30000, // 30 segundos
  });
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: playersAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
