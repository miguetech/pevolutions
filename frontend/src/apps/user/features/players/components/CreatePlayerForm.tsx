import React, { useState } from 'react';
import { useCreatePlayer } from '../hooks/useCreatePlayer';

export const CreatePlayerForm: React.FC = () => {
  const [name, setName] = useState('');
  const [sex, setSex] = useState<0 | 1>(0);
  const { mutate, isPending, isError, error, isSuccess } = useCreatePlayer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.length < 3 || name.length > 20) {
      return;
    }

    mutate({ name, sex });
  };

  if (isSuccess) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center">
          <p className="text-green-400 text-lg mb-4">✅ Character created successfully!</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">🎮 Create New Character</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Character Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9]+"
            required
            disabled={isPending}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            placeholder="Enter character name (3-20 chars)"
          />
          <p className="text-xs text-gray-400 mt-1">Only letters and numbers allowed</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={0}
                checked={sex === 0}
                onChange={() => setSex(0)}
                disabled={isPending}
                className="cursor-pointer"
              />
              <span>Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={1}
                checked={sex === 1}
                onChange={() => setSex(1)}
                disabled={isPending}
                className="cursor-pointer"
              />
              <span>Female</span>
            </label>
          </div>
        </div>

        {isError && (
          <div className="p-3 bg-red-900/50 border border-red-500 rounded">
            <p className="text-red-400 text-sm">
              {error instanceof Error ? error.message : 'Failed to create character'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || name.length < 3}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium"
        >
          {isPending ? 'Creating...' : 'Create Character'}
        </button>
      </form>
    </div>
  );
};
