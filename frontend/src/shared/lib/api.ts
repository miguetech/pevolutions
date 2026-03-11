import ky from 'ky';
import type { Player } from '../types/player';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

export const api = ky.create({
  prefixUrl: API_URL,
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get'],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('token');
        if (token) {
          // Remove quotes from JSON string
          const cleanToken = token.replace(/^"(.*)"$/, '$1');
          request.headers.set('Authorization', `Bearer ${cleanToken}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      },
    ],
  },
});

// Players API
export const playersAPI = {
  getAll: () => api.get('api/players/').json<Player[]>(),
  
  getOnline: (params?: { limit?: number; sort_by?: string; search?: string }) =>
    api.get('api/players/online', { searchParams: params }).json<Player[]>(),
  
  create: (data: { name: string; sex: number }) =>
    api.post('api/players/', { json: data }).json<Player>(),
};

// Account API
export const accountAPI = {
  getStats: () => api.get('api/account/stats').json(),
  
  getMe: () => api.get('api/account/me').json(),
  
  changePassword: (current_password: string, new_password: string) =>
    api.put('api/account/password', { json: { current_password, new_password } }).json(),
};
