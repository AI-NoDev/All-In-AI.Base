FROM oven/bun AS build

WORKDIR /app

# Copy workspace files
COPY package.json bun.lock ./
COPY packages/ packages/
COPY apps/frontend/ apps/frontend/

# Install dependencies
RUN bun install

# Build frontend
WORKDIR /app/apps/frontend
RUN bun run build

FROM nginx:alpine

COPY --from=build /app/apps/frontend/build /usr/share/nginx/html
COPY --from=build /app/apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
