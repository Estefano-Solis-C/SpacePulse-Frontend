# Multi-Stage Build for SpacePulse Angular Frontend
# Stage 1: Build Angular SPA
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Production NGINX Server
FROM nginx:alpine
LABEL maintainer="SpacePulse DevOps Team <devops@spacepulse.com>"
COPY --from=build /app/dist/spacepulse-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
