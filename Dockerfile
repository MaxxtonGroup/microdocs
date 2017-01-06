FROM node:6

EXPOSE 3000
WORKDIR /microdocs/microdocs-server/dist
CMD ["node", "index.js"]

ADD microdocs-server/dist/node_modules /microdocs/microdocs-server/dist/node_modules
ADD microdocs-server/config.yml /microdocs/microdocs-server/config.yml
ADD microdocs-server/dist/ /microdocs/microdocs-server/dist/
ADD microdocs-ui/dist/ /microdocs/microdocs-ui/dist/