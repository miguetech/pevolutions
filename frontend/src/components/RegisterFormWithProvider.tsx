import { RegisterForm } from '@/auth/components/RegisterForm';
import { Providers } from './providers/Providers';

interface Props {
  lang?: 'en' | 'es' | 'pt';
}

export function RegisterFormWithProvider({ lang = 'es' }: Props) {
  const handleSuccess = () => {
    window.location.href = lang === 'es' ? '/login' : `/${lang}/login`;
  };

  return (
    <Providers>
      <RegisterForm onSuccess={handleSuccess} lang={lang} />
    </Providers>
  );
}
