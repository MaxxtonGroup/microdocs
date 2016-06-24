REM Script for running the MicroDocs Server and UI in a Docker container with a debugger attached and life reload
@echo off

SET CONTAINER_NAME=microdocs-dev
SET PORT=3000
SET PROJECT_DIR=/c/Users/steve/projects/microdocs-documentation-tool

docker stop %CONTAINER_NAME%
docker rm %CONTAINER_NAME%

docker run -d -p %PORT%:3000 --name %CONTAINER_NAME% -e "NODE_ENV=development" -v %PROJECT_DIR%:/microdocs -w /microdocs library/node:5.0 pwd & bash scripts/dev_entrypoint.sh