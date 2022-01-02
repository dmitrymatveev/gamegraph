# Using pushpin proxy server
FROM fanout/pushpin:1.34.0

# Create app directory
WORKDIR /usr/src/gamegraph

# Install Node.js
RUN apt-get update
RUN apt-get install curl
RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -
RUN apt-get install -y nodejs

# Build gamegraph from source
COPY src/ ./src
COPY package*.json ./
COPY tsconfig.json ./

RUN npm install -D
RUN npm run build

# Define default entrypoint and command
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pushpin", "--merge-output", ";", "npm", "run"]

# Run gamegraph application
# CMD [ "node", "build/index.js" ]