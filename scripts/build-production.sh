#!/bin/bash
# Build MicroDocs for production
#
# usage:
# - $DOCKERHUB_EMAIL
# - $DOCKERHUB_USERNAME
# - $DOCKERHUB_PASSWORD
# - $TAG
#
cd ..

# build microdocs-core
cd ./microdocs-core-ts
npm install
npm run prepublish
cd ./dist
npm link

# build microdocs-server
cd ../../microdocs-server
npm link @maxxton/microdocs-core
npm install
npm run package-distribution
cd ./dist
npm link @maxxton/microdocs-core
npm install --prod

# build microdocs-ui
cd ../../microdocs-ui
npm link @maxxton/microdocs-core
npm install
npm run package-distribution

# Deploy to dockerhub
docker login --email $DOCKERHUB_EMAIL --username $DOCKERHUB_USERNAME --password $DOCKERHUB_PASSWORD

bash docker rmi maxxton/microdocs || true
bash docker rmi maxxton/microdocs:$TAG || true

docker build --tag=maxxton/microdocs:$TAG --no-cache -f Dockerfile.prod .
docker push maxxton/microdocs:$TAG