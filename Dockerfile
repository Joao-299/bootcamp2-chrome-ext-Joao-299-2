FROM node:20-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npx playwright install --with-deps chromium

COPY . .

CMD ["npm", "test"]