FROM node:6

RUN npm install -g gulp

ADD ./microdocs-core-ts/src /microdocs/microdocs-core-ts/src
ADD ./microdocs-core-ts/package.json /microdocs/microdocs-core-ts/package.json
ADD ./microdocs-core-ts/gulpfile.js /microdocs/microdocs-core-ts/gulpfile.js
WORKDIR /microdocs/microdocs-core-ts
RUN npm install && npm run prepublish && npm link

ADD ./microdocs-ui/src /microdocs/microdocs-ui/src
ADD ./microdocs-ui/.npmrc /microdocs/microdocs-ui/.npmrc
ADD ./microdocs-ui/package.json /microdocs/microdocs-ui/package.json
ADD ./microdocs-ui/gulpfile.js /microdocs/microdocs-ui/gulpfile.js
WORKDIR /microdocs/microdocs-ui
RUN npm install && npm run link && npm run package-distribution

ADD ./microdocs-server/src /microdocs/microdocs-server/src
ADD ./microdocs-server/package.json /microdocs/microdocs-server/package.json
ADD ./microdocs-server/gulpfile.js /microdocs/microdocs-server/gulpfile.js
ADD ./microdocs-server/index.js /microdocs/microdocs-server/index.js
ADD ./microdocs-server/data/config /microdocs/microdocs-server/data/config
ADD ./microdocs-server/config.yml /microdocs/microdocs-server/config.yml
WORKDIR /microdocs/microdocs-server
RUN npm install && npm run link && npm run package-distribution

EXPOSE 3000

cmd ["node", "index.js"]