import React, { useState } from 'react';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/auth/stores/authAtoms';
import { useUpdateSettings } from '../hooks/useUpdateSettings';
import { CountrySelector } from '@/shared/components/navigation/CountrySelector';

export const SettingsForm: React.FC = () => {
  const user = useAtomValue(userAtom);
  const [email, setEmail] = useState(user?.email || '');
  const [flag, setFlag] = useState(user?.flag || '');
  const { mutate, isPending, isError, error, isSuccess } = useUpdateSettings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, flag });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">⚙️ Account Settings</h3>

      {isSuccess && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded">
          <p className="text-green-400 text-sm">✅ Settings updated successfully!</p>
        </div>
      )}

      {isError && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded">
          <p className="text-red-400 text-sm">
            {error instanceof Error ? error.message : 'Failed to update settings'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <CountrySelector
            label="Country"
            placeholder="Select your country"
            value={flag}
            onChange={setFlag}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};
