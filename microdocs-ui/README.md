# MicroDocs UI
Angular 2 ui for visualising all the definitions and human readable Api documentation.

## Setup Development
This project depends on microdocs-core-ts
```
# link microdocs-core-ts
cd ../microdocs-core-ts
npm link

# init
cd ../microdocs-ui
npm install
npm run link

# compile and watch
gulp
```


## Setup Production
You can use the Dockerfile in the [parent folder](../) to build a Docker image which contains the server and ui.
```
$ docker build -t microdocs . 
```
