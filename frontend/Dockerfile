# Local Dev Docker Container (Not for Openshift use!)
# Build Stage
FROM node:lts-alpine as build-stage

# Move to App Folder
WORKDIR /app

# Install NPM Dependencies
COPY package*.json ./
RUN npm ci --no-optional

# Build Application
COPY . /app
RUN npm run build


# NR-Get-Token
FROM node:lts-alpine

# Install Http Server
RUN npm i http-server -g

# Copy Application
RUN mkdir /app
COPY --from=build-stage /app/dist /app

EXPOSE 8080
CMD ["http-server", "/app"]
