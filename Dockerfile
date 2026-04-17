# ============================================================
# STAGE 1: BUILD Angular
# ============================================================
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# ============================================================
# STAGE 2: SERVE with nginx
# ============================================================
FROM nginx:alpine AS runtime

# Copy nginx config template (PORT placeholder replaced at startup)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files
COPY --from=build /app/dist/quantity-measurement-frontend/browser /usr/share/nginx/html

# Copy startup script that injects API_URL into JS bundles at runtime
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8080

# start.sh replaces __API_URL__ in JS files and __PORT__ in nginx.conf, then starts nginx
CMD ["/start.sh"]
