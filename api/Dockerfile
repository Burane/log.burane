FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build

FROM node:16
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/.env /app/
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/prisma ./prisma
CMD [ "npm", "run", "start:migrate:prod" ]
