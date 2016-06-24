#!/bin/bash
# Script for running the MicroDocs Server and UI in a Docker container with a debugger attached and life reload

CONTAINER_NAME=microdocs-dev
PORT=3000

#docker stop ${CONTAINER_NAME}
#docker rm ${CONTAINER_NAME}

docker run -d -p ${PORT}:3000 --name ${CONTAINER_NAME} -e "NODE_ENV=development" -v `pwd`:/microdocs -w /microdocs library/node:6 scripts/dev_entrypoint.sh