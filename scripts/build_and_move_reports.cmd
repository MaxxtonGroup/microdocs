
REM build and move reports from the maxxton-services

SET folder=../maxxton-services

cd microdocs-crawler-doclet
cmd.exe /c gradle fatjar

cd ../microdocs-crawler-gradle
rm src/main/resources/microdocs-crawler-doclet.jar
cp ../microdocs-crawler-doclet/build/libs/microdocs-crawler-doclet-all-1.0.jar src/main/resources/microdocs-crawler-doclet.jar
cmd.exe /c gradle uploadArchives
cd ../

for /D %%i in (%folder%\*) do (call :build_and_move %%~ni)

cd ../../microservice-documentation-tool
GOTO :end

:build_and_move
echo ..\maxxton-services\%1
 IF ["%1"] NEQ  [""] (
     rmdir /S /Q microdocs-server\data\reports\services\%1

     cd %folder%/%1
     cmd.exe /c gradle microDocs

     cd ../../microservice-documentation-tool
     mkdir microdocs-server\data\reports\services\%1\1.0.0
     xcopy /s "%folder%\%1\build\reports" "microdocs-server\data\reports\services\%1\1.0.0"
 )

:end