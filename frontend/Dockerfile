# Local Development Docker Container (Not for Openshift use!)
FROM node:lts-alpine

# Move to App Folder
WORKDIR /app

# Install NPM Dependencies
COPY package*.json ./
RUN npm ci --no-optional

# Copy Application
COPY . /app

EXPOSE 8080
CMD [ "npm", "run", "serve" ]
