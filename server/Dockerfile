FROM node:20-slim

# Install OpenSSL (Required for Prisma)
RUN apt-get update -y && apt-get install -y openssl ca-certificates

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port (Matches standard Express port)
EXPOSE 9000

# Start command
CMD ["npm", "start"]
