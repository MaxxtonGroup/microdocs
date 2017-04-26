# Get Started MicroDocs

MicroDocs is a simple but powerful tool which keeps the overview when you are working with MicroServices.
This article explains the flow of how you can use MicroDocs. 
 
## Introduction

MicroDocs make use of the definition **project** across the whole flow.
A project is an abstraction layer for every component in you application landscape.
It could be anything: e.g. web server, web application, mobile app, database or a library.
Each project may consist internally of the following architecture layers: 
* **controllers**: Layer which accepts incomming messages
* **services**: Central place for handling logic
* **domain models**: Definition of the enitties
* **clients**: Layer which handles outgoing messages
* **repositories**: Layer which handles mapping of the domain models with the database

All projects can be defined using the **MicroDocs definition**, the default filename for these documents are **microdocs.json**. 
The MicroDocs definition is backwards compatible with the Open Api specifications.

## Flow
The flow for MicroDocs (*Image1*) starts with you source code.
There are currently several [plugins](#/documentation/plugins/index) which can transforms your source code into a MicroDocs definition.
Each definition than can be published to the MicroDocs server. 
This server keeps track of each version across different environments and you also can organise the projects into different groups.
This central server gives the advantage that you only have to look in a single place for all the definition and it also enables MicroDocs to do its little magic.

![MicroDocs Flow](/src/assets/images/docs/microdocs-flow.png)
*Image1 - MicroDocs Flow*

When there're 2 or more definitions stored, MicroDocs can check for compatibility issues between projects. 
For example: **service A** request the resource ``/api/customers`` from **service B**. But the resource on **service B** has been renamed to ``/api/clients``. 
The little magic of MicroDocs can detect that the request resource ``/api/customers`` doesn't exists anymore on **service B**.

The MicroDocs server has an **Api explorer**, which shows you clear Api documentation of all the projects/versions/environments together with the compatibility issues in one UI.
A demo of the Api explorer can be found [here](//microdocs.io/demo/index.html).
The MicroDocs server offers an Api for integrations with several other tools.
With export formats to other definition standards like Open Api (former known as Swagger), Api Blueprints and postman it is easy to integrate with existing tools like a Mock servers and Api testing. 

In the next article [Introduction Example App](intro-example-app) we'll start explaining how MicroDocs can integrate with a Continuous Deployment pipeline in Jenkins using a sample application landscape (which will illustrate a MicroService architecture).





