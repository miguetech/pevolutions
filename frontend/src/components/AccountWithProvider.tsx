import Account from '@/apps/user/features/account/Account';
import { Providers } from './providers/Providers';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

export function AccountWithProvider({ lang }: Props) {
  return (
    <Providers>
      <Account lang={lang} />
    </Providers>
  );
}
