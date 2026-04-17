# ============================================================
# STAGE 1: BUILD Angular app
# ============================================================
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Replace placeholder API URL with the build arg
ARG API_URL=http://localhost:5042
RUN sed -i "s|RENDER_API_URL_PLACEHOLDER|${API_URL}|g" src/environments/environment.prod.ts

# Build for production
RUN npm run build

# ============================================================
# STAGE 2: SERVE with nginx
# ============================================================
FROM nginx:alpine AS runtime

# Copy custom nginx config for Angular SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular files from stage 1
# Angular 17+ outputs to dist/<project-name>/browser/
COPY --from=build /app/dist/quantity-measurement-frontend/browser /usr/share/nginx/html

# Render provides PORT env var; nginx must listen on it
# We use envsubst to inject PORT into nginx config at runtime
EXPOSE 8080

# Use shell form to substitute $PORT at runtime
CMD sh -c "sed -i 's/listen 8080/listen '\"${PORT:-8080}\"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
