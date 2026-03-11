import { RegisterForm } from '@/auth/components/RegisterForm';
import { Providers } from './providers/Providers';

export function RegisterFormWithProvider() {
  const handleSuccess = () => {
    window.location.href = '/login';
  };

  return (
    <Providers>
      <RegisterForm onSuccess={handleSuccess} />
    </Providers>
  );
}
