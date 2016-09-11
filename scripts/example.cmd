@echo off
REM This script starts up the latest MicroDocs server and publish the definitions of the example projects

docker stop microdocs-example
docker rm microdocs-example

docker run --name microdocs-example -p 3000:3000 -d maxxton/microdocs

cd ../example/customer-service
cmd.exe /c gradle publishMicroDocs

cd ../order-service
cmd.exe /c gradle publishMicroDocs

cd ../product-service
cmd.exe /c gradle publishMicroDocs

cd ../task-service
cmd.exe /c gradle publishMicroDocs

cd ../../scripts
echo MicroDocs example is ready at: http://localhost:3000
