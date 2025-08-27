# Этап сборки
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап сервера
FROM nginx:alpine

# Копируем собранное приложение в папку Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Настройка Nginx (по умолчанию index.html будет отдаваться)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
