FROM node:22-alpine

WORKDIR /app

ARG NEXT_PUBLIC_KYC_API_URL
ENV NEXT_PUBLIC_KYC_API_URL=${NEXT_PUBLIC_KYC_API_URL}
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3003

CMD ["npm", "run", "start", "--", "--port", "3003"]