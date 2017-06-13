FROM node:6

# Install microdocs-core
ADD ./microdocs-core/dist/package.json ./microdocs-core/dist/.npmrc /app/@maxxton/microdocs-core/dist/
WORKDIR /app/@maxxton/microdocs-core/dist
RUN npm link

# Install microdocs-server
WORKDIR /app/@maxxton/microdocs-server
ADD ./microdocs/microdocs-server/package.json ./microdocs/microdocs-server/.npmrc ./
RUN npm link @maxxton/microdocs-core
RUN npm install

# Build microdocs-server
ADD ./microdocs-core/dist /app/@maxxton/microdocs-core/dist
ADD ./microdocs/microdocs-server/src ./src
ADD ./microdocs/microdocs-server/gulpfile.js ./microdocs/microdocs-server/build.js ./microdocs/microdocs-server/config.yml ./
RUN ./node_modules/.bin/gulp prepublish
CMD rm -rf ./dist/* && ./node_modules/.bin/gulp watch