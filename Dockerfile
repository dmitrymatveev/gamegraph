# = = = = = = = = = = = = = = = = =
# Build application from source
# = = = = = = = = = = = = = = = = =
FROM node:17-alpine as builder

# Copy relevant source files
WORKDIR /usr/src/gamegraph
COPY src/ ./src 
COPY package*.json ./
COPY tsconfig.json ./

# Build and package
RUN npm install && \
    npm run build && \
    npm run package:linux-x64

# = = = = = = = = = = = = = = = = =
# Run application inside pushpin proxy
# = = = = = = = = = = = = = = = = =
FROM fanout/pushpin:1.34.0
COPY --from=builder /usr/src/gamegraph/gamegraph /usr/bin/gamegraph
CMD pushpin --merge-output & gamegraph

EXPOSE 8080