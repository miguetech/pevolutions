import ky from 'ky';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000';

export const api = ky.create({
  prefixUrl: API_URL,
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get'],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem('token');
        if (token) {
          // Remove quotes from JSON string
          const cleanToken = token.replace(/^"(.*)"$/, '$1');
          request.headers.set('Authorization', `Bearer ${cleanToken}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      },
    ],
  },
});

