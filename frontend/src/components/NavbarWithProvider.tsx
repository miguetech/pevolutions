import Navbar from './Navbar';
import { Providers } from './providers/Providers';

interface Props {
  lang: 'en' | 'es' | 'pt';
}

export function NavbarWithProvider({ lang }: Props) {
  return (
    <Providers>
      <Navbar lang={lang} />
    </Providers>
  );
}
