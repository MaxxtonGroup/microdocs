# MicroDocs Server
Express server for storing project definitions and check for compatibility problems. 

## Setup Development
This project depends on microdocs-core
```
# link microdocs-core
cd ../microdocs-core
npm link

# init
cd ../microdocs-server
npm install
npm run link

# compile and watch
npm run watch
```


## Setup Production
You can use the Dockerfile in the [parent folder](../) to build a Docker image which contains the server and ui.
```
$ docker build -t microdocs . 
```

## Rest Api

### ```GET /api/v1/projects```
List of all projects info with their
  
#### Response
**Code:** 200
**Body** (application/json)
```
[
  {
    "order-service": {
      "group": "services",
      "version": "2.0.0",
      "versions": ["2.0.0","1.0.0"]
    }
  }
]
```

### ```GET /api/v1/projects/{title}```
Get project definitions

**Parameters**
* ```version``` (optional) - get a specific version
  
#### Response
**Code:** 200
**Body** (application/json)
```
{
  ...project definitions...
}
```

### ```PUT /api/v1/reindex```
Reindex all projects

#### Response
**Code:** 200

### ```POST /api/v1/check```
Check new definition for problems

#### Request
**Parameters**
* ```project``` (required or provide in the project definitions)

**Body** (application/json)
```
{
  ...project definitions...
}
```

#### Response
**Code:** 200
**Body** (application/json)
```
{
  "status": "failed",
  "message": "1 problem found"
  "problems": [
    {
      "level": "ERROR",
      "message": "problem someware"
    }
  ]
}
```

### ```PUT /api/v1/projects/{title}```
Publish new project definitions

#### Request
**Parameters**
* ```title``` (required) - name of the project
* ```version``` (required or provide in the project definitions)
* ```group``` (required or provide in the project definitions)
* ```failOnProblems``` (optional) - don't publish when problems are found

**Body** (application/json)
```
{
  ...project definitions...
}
```

#### Response
**Code:** 200
**Body** (application/json)
```
{
  "status": "failed",
  "message": "1 problem found"
  "problems": [
    {
      "level": "ERROR",
      "message": "problem someware"
    }
  ]
}
```
