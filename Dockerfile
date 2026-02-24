# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências (incluindo devDependencies para build)
RUN npm install

# Copia o código-fonte inteiro
COPY . .

# Compila o TypeScript
RUN npx tsc

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Variável de ambiente port padrão
ENV PORT=3000

# Copia dependências
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm install --omit=dev

# Copia o Build finalizado (código transpilado) do stage builder
COPY --from=builder /app/dist ./dist

EXPOSE ${PORT}

# Inicia a aplicação usando os arquivos transpilados
CMD ["node", "dist/api/index.js"]
