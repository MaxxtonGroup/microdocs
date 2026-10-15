FROM node:14-alpine@sha256:434215b487a329c9e867202ff89e704d3a75e554822e07f3e0c0f9e606121b33

# Install microdocs-core
ADD ./microdocs-core/dist/package.json ./microdocs-core/dist/.npmrc /app/@maxxton/microdocs-core/dist/
WORKDIR /app/@maxxton/microdocs-core/dist
RUN npm link

# Install microdocs-ui
WORKDIR /app/@maxxton/microdocs-ui
ADD ./microdocs/microdocs-ui/package.json ./microdocs/microdocs-ui/.npmrc ./
RUN rm -rf /app/@maxxton/microdocs-core/dist/node_modules && npm link @maxxton/microdocs-core
RUN npm install

# Build microdocs-ui
ADD ./microdocs-core/dist /app/@maxxton/microdocs-core/dist
ADD ./microdocs/microdocs-ui/angular-cli.json ./
CMD rm -rf ./dist/* && ./node_modules/.bin/ng build --watch
