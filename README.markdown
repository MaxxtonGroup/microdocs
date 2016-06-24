[![Build Status](https://travis-ci.org/MaxxtonGroup/microservice-documentation-tool.svg?branch=master)](https://travis-ci.org/MaxxtonGroup/microservice-documentation-tool)
# Microservice Documentation tool

This is an advanced tool which can automatically documentate your whole microservice architecture. 
It supports REST endpoints and clients which consumes those endpoints. 
With this information it can draw fancy graphs and detect breaking changes between services.

## How does it work?
* All information (like endpoints, clients, domain models, repositories) are extracted from a project to a json file.
* This json file is then being analysed and aggregated so the data could be accessed quickly.
* A web frontend uses the aggregated data to show smart and useful documentation. 
* Other tools can be integrated, so they can access the data.

(Currently Java Spring projects are supported for extracting information automatically. 
But almost any kind of tool could be used to extract the necessary information from other kinds of projects  

## Setup

1. **Setup the frontend**
   Copy the content of the web folder to any kind of webserver (eg. apache/nginx) with php5 support
   
2. **Configuration**
    Make a new folder '/projects' on the webserver (in this folder all the project information will be stored).
    Edit the file '/scripts/settings.json' and adjust it to match your needs.

3. **Setup your projects**
   You need to extract the information from your project. A good way too do this, is by including some plugin in your build tool.
   In this example I use Gradle as build tool and the 'gradle-plugin' from this repository as plugin.
   This plugin adds some extra tasks to my build tool, so now I can extract javadoc/sources/api documentation from my project.
   But for example a typescript project you could use typedocs as a plugin for your npm build tool. This extract documentation of your typescript project, just like javadoc for java.
   
4. **Move the generated documentation**
   Copy the generated documentation to /projects/{group}/{projectName}/{version}/ on the webserver.
   (tip: use a build server eg. Jenkins to automate this process)
   
5. **Analyse the data**
   After you add/modify documentation, you need to run '/scripts/reindex.php' to analyse all the data.
   
## Save time and enjoy!

