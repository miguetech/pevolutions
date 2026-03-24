import { useQuery } from '@tanstack/react-query';
import { serverAPI } from '@/shared/api/serverAPI';

export function useServerInfo() {
  return useQuery({
    queryKey: ['server', 'info'],
    queryFn: serverAPI.getInfo,
    refetchInterval: 30000,
  });
}

export function useTopPlayers(limit: number = 10) {
  return useQuery({
    queryKey: ['players', 'top', limit],
    queryFn: () => serverAPI.getTopPlayers(limit),
    refetchInterval: 60000,
  });
}

export function useTopGuilds(limit: number = 10) {
  return useQuery({
    queryKey: ['guilds', 'top', limit],
    queryFn: () => serverAPI.getTopGuilds(limit),
    refetchInterval: 60000,
  });
}

export function useSupportStaff() {
  return useQuery({
    queryKey: ['support', 'staff'],
    queryFn: serverAPI.getSupportStaff,
    staleTime: 300000,
  });
}

export function useDownloads() {
  return useQuery({
    queryKey: ['downloads'],
    queryFn: serverAPI.getDownloads,
    staleTime: 300000,
    retry: 1,
    retryDelay: 1000,
  });
}
