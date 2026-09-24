# ==========================================
# Frontend Dockerfile (Astro + Nginx Multi-stage)
# ==========================================

# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Argumento para la URL de la API durante la compilación
ARG PUBLIC_API_URL=http://localhost:8000
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el código fuente y compilar
COPY . .
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine

# Reemplazar configuración por defecto
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los artefactos estáticos generados por Astro
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 4321

CMD ["nginx", "-g", "daemon off;"]
