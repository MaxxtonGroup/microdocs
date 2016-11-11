FROM node:6

RUN npm install -g gulp

RUN mkdir -p /microdocs/microdocs-server
RUN mkdir -p /microdocs/microdocs-ui

# Get dependencies for microdocs-ui
WORKDIR /microdocs/microdocs-ui
ADD ./microdocs-ui/.npmrc /microdocs/microdocs-ui/
ADD ./microdocs-ui/package.json /microdocs/microdocs-ui/
RUN npm install

# Get dependencies for microdocs-server
WORKDIR /microdocs/microdocs-server
ADD ./microdocs-server/.npmrc /microdocs/microdocs-server/
ADD ./microdocs-server/package.json /microdocs/microdocs-server/
RUN npm install

# Build microdocs-ui
WORKDIR /microdocs/microdocs-ui
ADD ./microdocs-ui /microdocs/microdocs-ui
RUN npm run package-distribution

# Build microdocs-server
WORKDIR /microdocs/microdocs-server
ADD ./microdocs-server /microdocs/microdocs-server
RUN npm run package-distribution

EXPOSE 3000

WORKDIR /microdocs/microdocs-server
cmd ["npm", "start"]