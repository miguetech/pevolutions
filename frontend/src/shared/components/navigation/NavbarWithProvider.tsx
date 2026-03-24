import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './Navbar';

const queryClient = new QueryClient();

interface Props {
  lang: 'en' | 'es' | 'pt';
}

export function NavbarWithProvider({ lang }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar lang={lang} />
    </QueryClientProvider>
  );
}
