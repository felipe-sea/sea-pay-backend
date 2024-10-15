# Use a imagem oficial do Node.js versão 20
FROM node:20-alpine

# Instale o bash para permitir a execução de scripts bash
RUN apk add --no-cache bash

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação
COPY . .

# Crie o arquivo .env com as configurações do banco de dados
RUN echo "DATABASE_URL=postgresql://postgres:postgres@db:5432/sea_pay?schema=public" > .env

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "run", "start"]