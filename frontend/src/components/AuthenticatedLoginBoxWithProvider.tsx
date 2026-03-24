import { AuthenticatedLoginBox } from './AuthenticatedLoginBox';
import { Providers } from './providers/Providers';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

export function AuthenticatedLoginBoxWithProvider({ lang }: Props) {
  return (
    <Providers>
      <AuthenticatedLoginBox lang={lang} />
    </Providers>
  );
}
