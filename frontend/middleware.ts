import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const token = cookies.get('token')?.value;
  const path = url.pathname;

  // Rutas admin y usuario son protegidas del lado cliente por los componentes React
  // (mientras la sesión se gestione con token en localStorage)

  // Rutas de usuario requieren autenticación
  if (path.startsWith('/account')) {
    if (!token) {
      return redirect('/login?redirect=' + encodeURIComponent(path));
    }
  }

  return next();
});
