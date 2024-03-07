# Etapa de construcción
FROM node:20.11.1 AS imagenNode
 
WORKDIR /app
 
# Copia los archivos del proyecto
COPY package.json yarn.lock ./
 
# Instala todas las dependencias, incluyendo las de desarrollo
RUN yarn install
 
# Copia los archivos necesarios para la construcción
COPY . .
 
# Construye la aplicación
RUN yarn build --verbose
 
# Etapa de producción usando Nginx
FROM nginx:alpine
 
# Copia los archivos estáticos desde la etapa de construcción
COPY --from=imagenNode /app/www /usr/share/nginx/html
 
# Opcional: Copia la configuración de Nginx personalizada si es necesario
# COPY nginx.conf /etc/nginx/nginx.conf
 
# Exponer el puerto para el servidor Nginx
EXPOSE 80
 
# El comando por defecto de Nginx ya arranca el servidor, no es necesario especificar CMD