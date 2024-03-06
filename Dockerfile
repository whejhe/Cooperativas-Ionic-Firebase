# Etapa de construcción
FROM node:20.11.1 AS build
 
WORKDIR /app
 
# Copia y instala dependencias
COPY package.json yarn.lock ./
RUN yarn install --production
 
# Copia los archivos necesarios
COPY . ./

RUN npm run-script build:prod

RUN ls -la /app/
 
# Etapa de producción
FROM node:20.11.1 AS production
 
WORKDIR /app
 
# Copia desde la etapa de construcción
COPY --from=build /app ./
 
# Exponer el puerto de la aplicación
EXPOSE 5008
 
# Comando para ejecutar la aplicación
CMD ["npm", "start"]