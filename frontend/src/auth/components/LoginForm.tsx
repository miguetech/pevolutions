import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/authAPI';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; password?: string }>({});
  
  const { setToken, setUser } = useAuth();

  const loginMutation = useMutation({
    mutationFn: () => authAPI.login({ name, password }),
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      onSuccess?.();
    },
  });

  const validate = () => {
    const newErrors: { name?: string; password?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    loginMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {errors.name && (
          <p className="text-red-400 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {loginMutation.error && (
        <p className="text-red-400 text-sm">Invalid credentials</p>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-white font-medium"
      >
        {loginMutation.isPending ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
