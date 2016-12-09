FROM node:6

ARG PROXY_URL
RUN npm set registry ${PROXY_URL:-https://registry.npmjs.org/}

RUN npm install -g gulp

RUN mkdir -p /microdocs/microdocs-core-ts
RUN mkdir -p /microdocs/microdocs-server
RUN mkdir -p /microdocs/microdocs-ui

# Get dependencies for microdocs-core
WORKDIR /microdocs/microdocs-core-ts
ADD ./microdocs-core-ts/.npmrc /microdocs/microdocs-core-ts/
ADD ./microdocs-core-ts/package.json /microdocs/microdocs-core-ts/
ADD ./microdocs-core-ts/typings.json /microdocs/microdocs-core-ts/
RUN npm install

# Build microdocs-core
ADD ./microdocs-core-ts /microdocs/microdocs-core-ts
RUN npm run prepublish
WORKDIR /microdocs/microdocs-core-ts/dist
RUN npm link

# Get dependencies for microdocs-ui
WORKDIR /microdocs/microdocs-ui
ADD ./microdocs-ui/.npmrc /microdocs/microdocs-ui/
ADD ./microdocs-ui/package.json /microdocs/microdocs-ui/
ADD ./microdocs-ui/typings.json /microdocs/microdocs-ui/
RUN npm link @maxxton/microdocs-core && npm install

# Get dependencies for microdocs-server
WORKDIR /microdocs/microdocs-server
ADD ./microdocs-server/.npmrc /microdocs/microdocs-server/
ADD ./microdocs-server/package.json /microdocs/microdocs-server/
ADD ./microdocs-server/typings.json /microdocs/microdocs-server/
RUN npm link @maxxton/microdocs-core && npm install
RUN /microdocs/microdocs-server/node_modules/.bin/typings install

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