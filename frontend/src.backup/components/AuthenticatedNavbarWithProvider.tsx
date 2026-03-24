import AuthenticatedNavbar from './AuthenticatedNavbar';
import { Providers } from './providers/Providers';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

export function AuthenticatedNavbarWithProvider({ lang }: Props) {
  return (
    <Providers>
      <AuthenticatedNavbar lang={lang} />
    </Providers>
  );
}
