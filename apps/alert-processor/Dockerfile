FROM node:25.6.1-alpine3.23 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate --schema=apps/alert-processor/prisma/schema.prisma

RUN npx nx build alert-processor

# _____________________________________________ #

FROM node:25.6.1-alpine3.23 AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=builder /app/dist/apps/alert-processor ./

RUN npm install --omit=dev && npm install prisma @prisma/adapter-pg pg

COPY apps/alert-processor/prisma ./prisma
COPY apps/alert-processor/prisma.config.ts ./prisma.config.ts

RUN DATABASE_URL="postgresql://dummy:dummy@localhost/dummy" npx prisma generate

COPY apps/alert-processor/entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "main.js"]