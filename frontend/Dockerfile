FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
# We need to accept a build arg and set it as an env var for Vite
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM nginx:alpine
# Copy built static files to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port for Cloud Run
EXPOSE 8080

# Nginx config to listen on 8080
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf

# Support client-side routing
RUN sed -i '/index  index.html index.htm;/a \        try_files $uri $uri/ /index.html;' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
