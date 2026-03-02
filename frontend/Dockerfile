# ============================================
# Frontend Dockerfile - React (Multi-stage)
# ============================================

# --- Stage 1: Build ---
FROM node:18-alpine AS build

WORKDIR /app

# Copiar dependencias primero (cache de Docker)
COPY package.json package-lock.json* ./
RUN npm install

# Copiar código fuente y construir
COPY public/ ./public/
COPY src/ ./src/

RUN npm run build

# --- Stage 2: Runtime con Nginx ---
FROM nginx:1.25-alpine

# Eliminar configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada de Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos del build
COPY --from=build /app/build /usr/share/nginx/html

# Usuario no-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
