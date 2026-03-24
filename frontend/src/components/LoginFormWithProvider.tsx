import { LoginForm } from '@/auth/components/LoginForm';
import { Providers } from './providers/Providers';

export function LoginFormWithProvider() {
  const handleSuccess = () => {
    window.location.href = '/';
  };

  return (
    <Providers>
      <LoginForm onSuccess={handleSuccess} />
    </Providers>
  );
}
