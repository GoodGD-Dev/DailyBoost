# Define a imagem base - Node.js 18 com Alpine Linux
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Informa que a aplicação escuta na porta 5000
EXPOSE 5000

# Define o comando que será executado quando o container for iniciado
CMD ["npm", "start"]