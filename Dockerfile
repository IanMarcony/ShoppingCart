FROM node:20-alpine

# Instalar netcat para health check
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package.json
COPY package.json ./

# Instalar dependências
RUN yarn install --frozen-lockfile

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh && \
   chmod +x /usr/local/bin/docker-entrypoint.sh

# Copiar código da aplicação
COPY . .

# Executar testes
RUN yarn test

# Expor porta da aplicação
EXPOSE 3333

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["yarn", "start"]
