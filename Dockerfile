FROM node:5.0

ADD ./microdocs-ui /microdocs/microdocs-ui
ADD ./microdocs-server /microdocs/microdocs-server

WORKDIR /microdocs/microdocs-ui
RUN npm install --production

WORKDIR /microdocs/microdocs-server
RUN npm install --production

EXPOSE 3000

cmd ["npm", "start"]