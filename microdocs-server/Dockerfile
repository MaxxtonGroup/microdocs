FROM node:6

# Install dependencies
WORKDIR /app/@maxxton/microdocs-core
ADD ./microdocs-core/dist/package.json .
RUN yarn link
WORKDIR /app/@maxxton/microdocs-server
ADD ./microdocs/microdocs-server/package.json .
RUN yarn link @maxxton/microdocs-core && yarn setup && yarn cache clean

# Build
ADD ./microdocs/microdocs-server/tsconfig.json ./microdocs/microdocs-server/tsconfig.build.json ./microdocs/microdocs-server/tslint.json ./
CMD ["yarn", "run", "watch"]