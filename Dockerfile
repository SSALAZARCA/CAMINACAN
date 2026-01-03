FROM node:20-alpine as builder

WORKDIR /app

# Install dependencies (caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# ARGS for build time (Vite requires VITE_ prefix to bake in variables)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npm run build

# --- Production Stage ---
FROM nginx:alpine

# Copy build artifacts
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
