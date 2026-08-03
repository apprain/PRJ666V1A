FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_KYC_URL
ARG NEXT_PUBLIC_SERVICE_URL
ENV NEXT_PUBLIC_KYC_URL=$NEXT_PUBLIC_KYC_URL
ENV NEXT_PUBLIC_SERVICE_URL=$NEXT_PUBLIC_SERVICE_URL

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3001
CMD ["npm", "run", "start", "--", "-p", "3001", "-H", "0.0.0.0"]
