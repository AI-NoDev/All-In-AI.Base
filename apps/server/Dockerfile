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

# Use oven/bun:slim as runtime (not compile to binary)
FROM oven/bun:slim

WORKDIR /app

# Copy installed node_modules and source
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/packages packages
COPY --from=build /app/apps/server apps/server
COPY --from=build /app/package.json package.json

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "run", "apps/server/src/index.ts"]
