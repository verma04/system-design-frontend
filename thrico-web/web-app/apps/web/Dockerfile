# Step 1: Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app

# Copy monorepo package files
COPY ../../package.json ../../turbo.json ./
COPY ../../apps/web/package.json ./apps/web/

# Install only the necessary dependencies
RUN npm install

# Step 2: Build the app
FROM node:18-alpine AS builder
WORKDIR /app

COPY ../../ ./
RUN npm run build --filter=web...

# Step 3: Serve with Next.js
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next .next
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json

RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
