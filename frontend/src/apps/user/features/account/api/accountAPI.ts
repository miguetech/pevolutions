import { api } from '@/shared/lib/api';

export interface AccountStats {
  total_playing_time: number;
  pokemon_caught: number;
  world_ranking: number;
}

export interface UpdateSettingsRequest {
  email?: string;
  flag?: string;
}

export const accountAPI = {
  getStats: () => api.get('api/account/stats').json<AccountStats>(),
  
  getMe: () => api.get('api/account/me').json(),
  
  changePassword: (current_password: string, new_password: string) =>
    api.put('api/account/password', { json: { current_password, new_password } }).json(),
  
  updateSettings: (data: UpdateSettingsRequest) =>
    api.put('api/account/settings', { json: data }).json(),
};
