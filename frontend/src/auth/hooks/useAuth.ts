import { useAtom, useAtomValue } from 'jotai';
import { tokenAtom, userAtom, isAuthenticatedAtom } from '../stores/authAtoms';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const queryClient = useQueryClient();

  const logout = () => {
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout,
  };
}
