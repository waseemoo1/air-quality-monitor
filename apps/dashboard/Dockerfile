FROM node:25.6.1-alpine3.23 AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

COPY . .

RUN npm ci

RUN npx nx build dashboard --configuration=production

FROM nginx:1.28.2-alpine3.23

COPY --from=builder /app/dist/apps/dashboard /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
