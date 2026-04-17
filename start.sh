#!/bin/sh

# Replace API URL placeholder in all JS bundles with the actual runtime value
# This runs when the container STARTS (not during build), so Render env vars work
if [ -n "$API_URL" ]; then
  echo "Injecting API_URL: $API_URL"
  find /usr/share/nginx/html -name '*.js' -exec sed -i "s|__API_URL__|${API_URL}|g" {} +
else
  echo "WARNING: API_URL not set! API calls will fail."
fi

# Replace PORT placeholder in nginx config (Render provides $PORT)
PORT=${PORT:-8080}
echo "Starting nginx on port: $PORT"
sed -i "s|__PORT__|${PORT}|g" /etc/nginx/conf.d/default.conf

# Start nginx
nginx -g 'daemon off;'
