# Этап 1: Сборка
# Мы используем образ с Node.js и инструментами сборки.
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN rm -rf generated

RUN npx prisma generate

# Этап 2: Продакшен
# Теперь мы создаём чистый образ для запуска.
# Он будет содержать только код и зависимости.
FROM node:20-alpine

WORKDIR /app

# Копируем только то, что нужно для запуска, с этапа "builder".
COPY --from=builder /app .

# Указываем команду для запуска приложения.
CMD ["node", "app.js"]