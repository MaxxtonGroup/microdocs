# Get started
MicroDocs consists out of crawlers, server, ui and integrations tools.
**Crawlers** generates definitions from the source code of a project.
These definitions are then published at the MicroDocs server.
The **server** then checks for compatibility problems and aggregate the result.
The **ui** or other **integration tools** request the result through the RestApi of the server.

## Setup MicroDocs Server
The MicroDocs server with the ui is available on [dockerhub](https://hub.docker.com/r/maxxton/microdocs/).
To install via Docker run:
```
$ docker run --name microdocs -v /microdocs-server/data -p 3000:3000 -d maxxton/microdocs
```

## Setup Crawlers
Crawlers are project and framework specific. Currently only the Spring framework is supported. 
The setup for each Crawler can be found in their subdirectories

## Setup Integrations tools
Integrations tools have their own setup. They can be found in their subdirectories
