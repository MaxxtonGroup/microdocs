pipeline {
  agent any
  parameters {
    string(name: 'TAG', defaultValue: '', description: 'Docker tag')
    string(name: 'CORE_VERSION', defaultValue: '', description: 'MicroDocs Core version')
    string(name: 'CLI_VERSION', defaultValue: '', description: 'MicroDocs ClI version')
  }

  stages {
    stage("Checkout") {
      steps {
        deleteDir()
        checkout scm
        stash name: 'source'
      }
    }
    stage('Build microdocs-server') {
      steps {
        unstash name: 'source'
        dir('microdocs-server') {
          sh "node -d -e \"var fs = require('fs'); var pJson = require('./package.json'); pJson.dependencies['@maxxton/microdocs-core'] = '${env.CORE_VERSION}'; fs.writeFileSync('./package.json', pJson);\""
          sh 'npm install'
          sh 'npm version ' + env.TAG
          sh 'npm run prepublish'
          sh 'cp .npmrc dist/.npmrc'
          dir('dist') {
            sh 'npm install --prod'
            stash name: 'server-dist'
          }
        }
      }
    }
    stage('Build microdocs-ui') {
      steps {
        unstash name: 'source'
        dir('microdocs-ui') {
          sh "node -d -e \"var fs = require('fs'); var pJson = require('./package.json'); pJson.dependencies['@maxxton/microdocs-core'] = '${env.CORE_VERSION}'; fs.writeFileSync('./package.json', pJson);\""
          sh 'npm install'
          sh 'npm version ' + env.TAG
          sh './node_modules/.bin/ng build --prod'
          dir('dist') {
            stash name: 'ui-dist'
          }
        }
      }
    }

    stage('Build docker image') {
      steps {
        unstash name: 'source'
        unstash name: 'server-dist'
        unstash name: 'ui-dist'

        sh 'docker build --tag=maxxton/microdocs:' + env.TAG + ' --no-cache --build-arg=CLI_VERSION=' + env.CLI_VERSION + ' .'
      }
    }
    stage('Public docker image') {
      steps {
        sh 'docker login --email $DOCKERHUB_EMAIL --username $DOCKERHUB_USERNAME --password $DOCKERHUB_PASSWORD'
        sh 'docker push maxxton/microdocs:' + env.TAG;
        sh 'docker tag maxxton/microdocs:' + env.TAG + ' maxxton/microdocs:latest'
        sh 'docker push maxxton/microdocs:latest'
      }
    }
  }
}