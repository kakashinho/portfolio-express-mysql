# Usa uma imagem Node.js leve e estável como base
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências do Node.js
# Isso aproveita o cache do Docker se as dependências não mudarem
RUN npm install --omit=dev

# Copia o restante do código da aplicação para o contêiner
COPY . .

# A porta que o Express está escutando (3000, conforme app.js)
EXPOSE 3000

# Comando para iniciar a aplicação (conforme "start": "node app.js" no package.json)
CMD [ "npm", "start" ]