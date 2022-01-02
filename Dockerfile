# = = = = = = = = = = = = = = = = =
# Build application from source
# = = = = = = = = = = = = = = = = =
FROM node:17-alpine as builder

# Copy relevant source files
WORKDIR /usr/src/gamegraph
COPY src/ ./src 
COPY package*.json ./
COPY tsconfig.json ./

# Run build process
RUN npm install && \
    npm run build

# = = = = = = = = = = = = = = = = =
# Only install production packages
# = = = = = = = = = = = = = = = = =
FROM node:17-alpine as cleaner

# Take build artifacts
WORKDIR /usr/src/gamegraph
COPY --from=builder /usr/src/gamegraph/package*.json ./
COPY --from=builder /usr/src/gamegraph/build ./

# Install production dependencies only
RUN npm install --only=production

# = = = = = = = = = = = = = = = = =
# Run application inside pushpin proxy
# = = = = = = = = = = = = = = = = =
FROM fanout/pushpin:1.34.0
WORKDIR /usr/src/gamegraph
COPY --from=cleaner /usr/src/gamegraph ./
CMD pushpin --merge-output

EXPOSE 8080