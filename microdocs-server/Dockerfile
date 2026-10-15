FROM node:14-alpine@sha256:434215b487a329c9e867202ff89e704d3a75e554822e07f3e0c0f9e606121b33

# Install dependencies
WORKDIR /app/@maxxton/microdocs-server
ADD ./microdocs-core/dist/package.json ./microdocs-core/dist/.npmrc ./node_modules/@maxxton/microdocs-core/
ADD ./microdocs/microdocs-server/package.json ./microdocs/microdocs-server/.npmrc ./
RUN npm install

# Build microdocs-server
ADD ./microdocs/microdocs-server/gulpfile.js ./microdocs/microdocs-server/build.js ./microdocs/microdocs-server/config.yml ./
CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch
