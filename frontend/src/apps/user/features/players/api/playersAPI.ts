import { api } from '@/shared/lib/api';
import type { Player } from '@/shared/types/player';

export type { Player };

export const getPlayers = () => api.get('api/players/').json<Player[]>();

export const createPlayer = (data: { name: string; sex: number }) =>
  api.post('api/players/', { json: data }).json<Player>();

export const playersAPI = {
  getPlayers,
  getAll: getPlayers,
  getOnline: (params?: { limit?: number; sort_by?: string; search?: string }) =>
    api.get('api/players/online', { searchParams: params }).json<Player[]>(),
  createPlayer,
  create: createPlayer,
};
