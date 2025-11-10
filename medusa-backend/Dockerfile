FROM node:20-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build do projeto
RUN npm run build

# Expor porta
EXPOSE 9000

# Comando para iniciar
CMD ["npm", "start"]

