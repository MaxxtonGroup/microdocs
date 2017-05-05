FROM node:6

EXPOSE 3000
WORKDIR /microdocs/microdocs-server/dist
CMD ["node", "index.js"]

ADD microdocs-server/config.yml /microdocs/microdocs-server/config.yml
ADD microdocs-server/dist/ /microdocs/microdocs-server/dist/
ADD microdocs-ui/dist/ /microdocs/microdocs-ui/dist/
RUN echo @maxxton:registry=https://npm.maxxton.com > ~/.npmrc && \
    npm install -g @maxxton/microdocs-cli@1.8.10