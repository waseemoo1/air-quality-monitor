FROM node:25.6.1-alpine3.23 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx nx build data-collector

# _____________________________________________ #

FROM node:25.6.1-alpine3.23 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist/apps/data-collector ./

RUN npm install --omit=dev

CMD ["node", "main.js"]