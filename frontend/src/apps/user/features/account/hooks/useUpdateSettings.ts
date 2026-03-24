import { useMutation } from '@tanstack/react-query';
import { accountAPI, type UpdateSettingsRequest } from '../api/accountAPI';
import { HTTPError } from 'ky';

export function useUpdateSettings() {
  return useMutation({
    mutationFn: async (data: UpdateSettingsRequest) => {
      try {
        return await accountAPI.updateSettings(data);
      } catch (error) {
        if (error instanceof HTTPError) {
          const body = await error.response.json();
          throw new Error(body.detail || 'Failed to update settings');
        }
        throw error;
      }
    },
  });
}
