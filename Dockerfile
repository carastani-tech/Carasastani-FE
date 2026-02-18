# Stage 1: Build
FROM node:22-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
ARG BUILD_CMD=build
ARG VITE_API_URL=https://carastani-qa.duckdns.org
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run $BUILD_CMD

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]