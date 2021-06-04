FROM node:14-alpine

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
