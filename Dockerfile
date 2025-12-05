FROM node:20-alpine

# Instalar netcat para health check
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Instalar dependências
RUN yarn install --frozen-lockfile

# Copiar código da aplicação
COPY . .

# Executar migrations
RUN yarn migration:run

# Executar testes
RUN yarn test

# Expor porta da aplicação
EXPOSE 3333

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["yarn", "start"]
