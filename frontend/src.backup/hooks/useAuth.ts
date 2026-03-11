import { useAtom, useSetAtom } from 'jotai';
import { tokenAtom, userAtom } from '@/stores/authAtoms';
import { authAPI, accountAPI } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const queryClient = useQueryClient();

  const login = async (username: string, password: string) => {
    try {
      const { access_token } = await authAPI.login(username, password);
      
      setToken(access_token);
      
      // Fetch user data
      try {
        const userData = await accountAPI.getMe();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
