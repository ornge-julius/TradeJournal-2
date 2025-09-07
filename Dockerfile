# Build stage
FROM node:18-alpine AS build
WORKDIR /app
# Install dependencies based on the package files
COPY app/package.json app/package-lock.json ./
RUN npm ci
# Copy the rest of the application source
COPY app/ .
# Build the production bundle
RUN npm run build

# Production stage
FROM nginx:1.25-alpine
# Copy built assets from the build stage
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 80 to allow binding by Docker / Kubernetes
EXPOSE 80
# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
