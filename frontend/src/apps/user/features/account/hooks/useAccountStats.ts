import { useQuery } from '@tanstack/react-query';
import { accountAPI } from '../api/accountAPI';

export function useAccountStats() {
  return useQuery({
    queryKey: ['account', 'stats'],
    queryFn: accountAPI.getStats,
    staleTime: 1000 * 60 * 5,
  });
}
