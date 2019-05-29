FROM node:lts-alpine

# Move to App Folder
WORKDIR /opt/app-root/src

# Install NPM Dependencies
COPY package*.json ./
RUN npm ci
# --no-optional --production

# Build Application
COPY . /opt/app-root/src
RUN npm run build
