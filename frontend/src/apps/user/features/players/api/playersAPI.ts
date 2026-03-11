import { api } from '@/shared/lib/api';
import type { Player } from '@/shared/types/player';

export const playersAPI = {
  getAll: () => api.get('api/players/').json<Player[]>(),
  
  getOnline: (params?: { limit?: number; sort_by?: string; search?: string }) =>
    api.get('api/players/online', { searchParams: params }).json<Player[]>(),
  
  create: (data: { name: string; sex: number }) =>
    api.post('api/players/', { json: data }).json<Player>(),
};
