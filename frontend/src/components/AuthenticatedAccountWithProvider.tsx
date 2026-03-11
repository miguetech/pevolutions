import AuthenticatedAccount from '@/apps/user/features/account/components/AuthenticatedAccount';
import { Providers } from './providers/Providers';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

export function AuthenticatedAccountWithProvider({ lang }: Props) {
  return (
    <Providers>
      <AuthenticatedAccount lang={lang} />
    </Providers>
  );
}
