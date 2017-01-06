node {
    stage('Checkout git'){
        git url: 'git@github.com:MaxxtonGroup/microdocs.git', branch: 'master'
    }
    stage('Publish microdocs-core'){
        sh 'cd microdocs-core'
        sh 'echo  "Installing npm dependencies"'
        sh 'npm install'
        sh 'echo "Publishing to private NPM registry"'
        sh 'npm run prepublish && npm publish dist'
    }
    stage('Publish microdocs-cli'){
        sh 'cd microdocs-cli'
        sh 'echo  "Installing npm dependencies"'
        sh 'npm install'
        sh 'echo "Publishing to private NPM registry"'
        sh 'npm run prepublish && npm publish dist'
    }
    stage('Build microdocs-server'){
        sh 'cd microdocs-server'
        sh 'echo  "Installing npm dependencies"'
        sh 'npm install'
        sh 'npm run package-distribution'
        sh 'cp .npmrc dist/.npmrc'
        sh 'cd dist'
        sh 'npm install --prod'
    }
    stage('Build microdocs-ui'){
        sh 'cd microdocs-ui'
        sh 'npm install'
        sh 'npm run package-distribution'
    }
    stage('Build docker image'){
        sh 'bash docker rmi maxxton/microdocs:dev || true'
        sh 'docker build --tag=maxxton/microdocs:dev --no-cache .'
    }
    stage('Public docker image'){
        sh 'docker login --email $DOCKERHUB_EMAIL --username $DOCKERHUB_USERNAME --password $DOCKERHUB_PASSWORD'
        sh 'docker push maxxton/microdocs:dev'
    }
}