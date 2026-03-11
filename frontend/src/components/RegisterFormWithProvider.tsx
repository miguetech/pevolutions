import { RegisterForm } from '@/auth/components/RegisterForm';
import { Providers } from './providers/Providers';

export function RegisterFormWithProvider() {
  const handleSuccess = () => {
    window.location.href = '/';
  };

  return (
    <Providers>
      <RegisterForm onSuccess={handleSuccess} />
    </Providers>
  );
}
