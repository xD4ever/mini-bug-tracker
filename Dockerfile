# Étape 1 : Construction de l'application Vue.js
FROM node:22-alpine AS build

WORKDIR /app

# Copie des fichiers de dépendances et installation
COPY package*.json ./
RUN npm ci

# Copie des sources et compilation de production
COPY . .
RUN npm run build

# Étape 2 : Image d'exécution basée sur Nginx
FROM nginx:alpine

# Copie des fichiers statiques générés vers le répertoire Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port HTTP
EXPOSE 80

# Démarrage de Nginx au premier plan
CMD ["nginx", "-g", "daemon off;"]
