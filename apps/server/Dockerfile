FROM oven/bun:1 AS build

WORKDIR /app

# Copy root package files for workspace
COPY package.json bun.lock turbo.json ./

# Copy all workspace packages
COPY packages/db/ packages/db/
COPY packages/actions/ packages/actions/
COPY packages/ai/ packages/ai/
COPY packages/actions-flow-editor/ packages/actions-flow-editor/
COPY packages/config/ packages/config/
COPY packages/i18n/package.json packages/i18n/package.json
COPY packages/i18n/paraglide/ packages/i18n/paraglide/

# Copy server app
COPY apps/server/ apps/server/

# Install dependencies
RUN bun install

# Build to single executable
ENV NODE_ENV=production
RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    apps/server/src/index.ts

# Use slim debian as runtime (distroless has China network issues)
FROM debian:bookworm-slim

WORKDIR /app

# Copy the compiled binary
COPY --from=build /app/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
