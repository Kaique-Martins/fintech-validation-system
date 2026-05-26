FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment configuration
ARG VITE_API_URL=http://backend:3001/api
ARG VITE_APP_VERSION=1.0.0

# Set environment variables for build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_VERSION=${VITE_APP_VERSION}

# Build the application
RUN npm run build

# Production stage - use nginx to serve the static files
FROM nginx:alpine

# Copy nginx configuration
RUN mkdir -p /etc/nginx/conf.d

# Create a simple nginx config for SPA
RUN echo 'server {\n\
    listen 3000;\n\
    server_name _;\n\
    root /app/dist;\n\
    index index.html;\n\
    \n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    \n\
    location /api/ {\n\
        proxy_pass http://backend:3001/api/;\n\
        proxy_http_version 1.1;\n\
        proxy_set_header Upgrade $http_upgrade;\n\
        proxy_set_header Connection '"'"'upgrade'"'"';\n\
        proxy_set_header Host $host;\n\
        proxy_cache_bypass $http_upgrade;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
