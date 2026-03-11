import { api } from '@/shared/lib/api';

export interface AccountStats {
  total_players: number;
  online_players: number;
}

export const accountAPI = {
  getStats: () => api.get('api/account/stats').json<AccountStats>(),
  
  getMe: () => api.get('api/account/me').json(),
  
  changePassword: (current_password: string, new_password: string) =>
    api.put('api/account/password', { json: { current_password, new_password } }).json(),
};
