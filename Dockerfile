FROM node:6

EXPOSE 3000
WORKDIR /microdocs/microdocs-server/dist
CMD ["node", "index.js"]

ADD microdocs-server/config.yml /microdocs/microdocs-server/config.yml
ADD microdocs-server/dist/ /microdocs/microdocs-server/dist/
ADD microdocs-ui/dist/ /microdocs/microdocs-ui/dist/
ARG CLI_VERSION
RUN echo @maxxton:registry=https://npm.maxxton.com > ~/.npmrc && \
    npm install -g @maxxton/microdocs-cli@$CLI_VERSION