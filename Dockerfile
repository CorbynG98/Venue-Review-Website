# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/dist ./dist
COPY --from=build-stage /app/index.html .
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]