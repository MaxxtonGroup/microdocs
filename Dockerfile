FROM node:14-alpine@sha256:434215b487a329c9e867202ff89e704d3a75e554822e07f3e0c0f9e606121b33

EXPOSE 3000
WORKDIR /microdocs/microdocs-server/dist
CMD ["node", "index.js"]

ADD microdocs-server/config.yml /microdocs/microdocs-server/config.yml
ADD microdocs-server/dist/ /microdocs/microdocs-server/dist/
ADD microdocs-ui/dist/ /microdocs/microdocs-ui/dist/
ARG CLI_VERSION
ARG NPM_TOKEN
RUN echo -e "@maxxton:registry=https://nexus-mxtf.maxxton.com/repository/npm-group/\n_auth=${NPM_TOKEN}" > ~/.npmrc
RUN npm install -g @maxxton/microdocs-cli@$CLI_VERSION
RUN cd /microdocs/microdocs-server/dist/ && npm install
