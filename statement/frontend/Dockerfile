FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install @tailwindcss/oxide-linux-x64-musl lightningcss-linux-x64-musl --save-dev

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start", "--", "-p", "3001"]