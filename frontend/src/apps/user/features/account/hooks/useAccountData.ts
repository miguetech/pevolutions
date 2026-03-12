import { useQuery } from '@tanstack/react-query';
import { accountAPI } from '../api/accountAPI';

export function useAccountData() {
  return useQuery({
    queryKey: ['account', 'me'],
    queryFn: accountAPI.getMe,
    staleTime: 1000 * 60 * 5,
  });
}
