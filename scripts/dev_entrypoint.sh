#!/bin/bash
# Script which is the entrypoint of the development Docker container.
# So this script is called when the Docker container boots.

cd microdocs-ui
#npm install

cd ../microdocs-server
#npm install

npm install -g nodemon

npm run debug