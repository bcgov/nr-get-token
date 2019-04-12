# Build Stage
FROM node:lts-alpine as build-stage

# Install Vue CLI Globally
RUN npm i @vue/cli -g

# Move to App Folder
COPY . /app
WORKDIR /app

# Install NPM Dependencies and Build
RUN npm ci --no-optional && npm run build


# NR-Get-Token
FROM nginx:alpine

LABEL maintainer="NR Common Service Showcase <NR.CommonServiceShowcase@gov.bc.ca>"
LABEL io.k8s.description="NR Get Token Frontend" \
      io.k8s.display-name="NR Get Token Frontend" \
      io.openshift.expose-services="80:http" \
      io.openshift.tags="builder,nginx"

# Openshift Changes
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf
EXPOSE 8080

# Get Build Results
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
