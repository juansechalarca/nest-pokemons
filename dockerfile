# Instalar dependencias solo cuando sea necesario
FROM node:18-alpine3.15 AS deps
# Verifica https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine para entender por qué se podría necesitar libc6-compat.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Construir la aplicación con dependencias en caché
FROM node:18-alpine3.15 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Imagen de producción, copiar todos los archivos y ejecutar la aplicación
FROM node:18-alpine3.15 AS runner

# Establecer directorio de trabajo
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --prod

COPY --from=builder /app/dist ./dist

CMD [ "node","dist/main" ]