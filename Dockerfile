FROM node:6

ADD ./microdocs-core-ts /microdocs/microdocs-core-ts
ADD ./microdocs-ui /microdocs/microdocs-ui
ADD ./microdocs-server /microdocs/microdocs-server

WORKDIR /microdocs/microdocs-core-ts
RUN npm install --production
RUN npm link

WORKDIR /microdocs/microdocs-ui
RUN npm install --production
RUN npm run linkProduction

WORKDIR /microdocs/microdocs-server
RUN npm install --production
RUN npm run linkProduction

EXPOSE 3000

cmd ["npm", "start"]