FROM node:20-alpine

# Install netcat for health check
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Initialization script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && \
   chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy application code
COPY . .

# Run tests
RUN yarn test

# Expose application port
EXPOSE 3333

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["yarn", "start"]
