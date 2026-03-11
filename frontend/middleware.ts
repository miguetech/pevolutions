import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const token = cookies.get('token')?.value;
  const path = url.pathname;

  // Rutas admin requieren autenticación y rol admin
  if (path.startsWith('/admin')) {
    if (!token) {
      return redirect('/login?redirect=' + encodeURIComponent(path));
    }
    // TODO: Verificar rol desde JWT cuando el backend lo soporte
  }

  // Rutas de usuario requieren autenticación
  if (path.startsWith('/account')) {
    if (!token) {
      return redirect('/login?redirect=' + encodeURIComponent(path));
    }
  }

  return next();
});
