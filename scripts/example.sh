#!/bin/bash
# This script starts up the latest MicroDocs server and publish the definitions of the example projects

docker stop microdocs-example
docker rm microdocs-example

docker run --name microdocs-example -p 3000:3000 -d maxxton/microdocs

cd ../example/customer-service
gradle publishMicroDocs

cd ../order-service
gradle publishMicroDocs

cd ../product-service
gradle publishMicroDocs

cd ../task-service
gradle publishMicroDocs

echo MicroDocs example is ready at: http://localhost:3000