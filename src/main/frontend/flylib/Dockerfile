FROM node:18 AS build

# Set working directory
WORKDIR /frontend

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of source code
COPY .. .

# Build
RUN npm run build

# Nginx web server
FROM nginx:alpine

# Copy build to webserver
COPY --from=build /frontend/dist /usr/share/nginx/html

# Copy nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ./certs/certificate.crt /etc/ssl/certs/certificate.crt
COPY ./certs/private.key /etc/ssl/private/private.key

# Expose port 80
EXPOSE 80
EXPOSE 443

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]