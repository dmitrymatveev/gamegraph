# = = = = = = = = = = = = = = = = =
# Build application from source
# = = = = = = = = = = = = = = = = =
FROM node:17-alpine as builder

# Copy relevant source files
WORKDIR /usr/src/gamegraph
COPY src/ ./src 
COPY package*.json ./
COPY tsconfig.json ./
COPY pushpin/ ./pushpin

# Build and package
RUN npm install && \
    npm run build && \
    npm run package:linux-x64

# = = = = = = = = = = = = = = = = = =
# Run application inside pushpin proxy
# = = = = = = = = = = = = = = = = = =
FROM fanout/pushpin:1.34.0
COPY --from=builder /usr/src/gamegraph/gamegraph /usr/bin/gamegraph
COPY --from=builder /usr/src/gamegraph/pushpin /etc/pushpin/
COPY --from=builder /usr/src/gamegraph/pushpin/routes_internal /etc/pushpin/routes

CMD pushpin --merge-output & gamegraph
# Pushpin exposed ports.
# - 7999: HTTP port to forward on to the app
# - 5560: ZMQ PULL for receiving messages
# - 5561: HTTP port for receiving messages and commands
# - 5562: ZMQ SUB for receiving messages
# - 5563: ZMQ REP for receiving commandsx