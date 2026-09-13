FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json nest-cli.json ./

# Render injects PORT at runtime; NestJS reads it from env
EXPOSE 10000
CMD ["node", "dist/main"]
