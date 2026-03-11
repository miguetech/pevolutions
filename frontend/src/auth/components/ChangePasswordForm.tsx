import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { accountAPI } from '@/shared/lib/api';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const changePasswordMutation = useMutation({
    mutationFn: () => accountAPI.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      onSuccess?.();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    changePasswordMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      <div className="space-y-2">
        <label htmlFor="currentPassword" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 transition-all"
        />
        {errors.currentPassword && (
          <p className="text-red-400 text-sm mt-1">{errors.currentPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="newPassword" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 transition-all"
        />
        {errors.newPassword && (
          <p className="text-red-400 text-sm mt-1">{errors.newPassword}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-accent/50 transition-all"
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {changePasswordMutation.error && (
        <p className="text-red-400 text-sm">Failed to change password</p>
      )}

      <button
        type="submit"
        disabled={changePasswordMutation.isPending}
        className="w-full py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
      >
        {changePasswordMutation.isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
