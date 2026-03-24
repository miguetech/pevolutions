import { api } from '@/shared/lib/api';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import type { User } from '../types/user';

export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post('api/auth/login', { json: credentials }).json<AuthResponse>(),
  
  register: (data: RegisterData) =>
    api.post('api/auth/register', { json: data }).json<User>(),
  
  logout: () => api.post('api/auth/logout').json(),
  
  me: () => api.get('api/auth/me').json<User>(),
};
