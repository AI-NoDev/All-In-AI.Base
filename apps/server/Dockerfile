FROM oven/bun AS build

WORKDIR /app

# Copy root package files for workspace
COPY package.json package.json
COPY bun.lock bun.lock

# Copy packages that server depends on
COPY packages/ packages/

# Copy server app
COPY apps/server/ apps/server/

RUN bun install

WORKDIR /app/apps/server

ENV NODE_ENV=production

RUN bun build src/index.ts --compile --outfile server

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/apps/server/server server

ENV NODE_ENV=production

CMD ["./server"]

EXPOSE 3000
