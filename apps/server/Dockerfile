FROM oven/bun AS build

WORKDIR /app

# Copy root package files for workspace
COPY package.json package.json
COPY bun.lock bun.lock
COPY turbo.json turbo.json

# Copy all packages (including i18n with paraglide)
COPY packages/ packages/

# Copy server app
COPY apps/server/ apps/server/

# Install dependencies with workspace resolution
RUN bun install

WORKDIR /app/apps/server

ENV NODE_ENV=production

# Build with explicit module resolution
RUN bun build src/index.ts --compile --outfile server

FROM debian:bookworm-slim

WORKDIR /app

# Install minimal runtime dependencies for Bun compiled binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/apps/server/server server

ENV NODE_ENV=production

EXPOSE 3000

CMD ["./server"]
