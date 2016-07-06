@echo off
REM build doclet and copy it to the order service

cd microdocs-crawler-doclet
cmd.exe /c gradle fatjar

cd ../
rm example/order-service/build/tmp/microdocs-crawler-doclet.jar
cp microdocs-crawler-doclet/build/libs/microdocs-crawler-doclet-all-1.0.jar example/order-service/build/tmp/microdocs-crawler-doclet.jar

cd example/order-service
cmd.exe /c gradle microdocs
cd ../../