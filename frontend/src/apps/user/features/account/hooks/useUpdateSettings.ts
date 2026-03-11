import { useMutation } from '@tanstack/react-query';
import { accountAPI, type UpdateSettingsRequest } from '../api/accountAPI';

export function useUpdateSettings() {
  return useMutation({
    mutationFn: (data: UpdateSettingsRequest) => accountAPI.updateSettings(data),
  });
}
