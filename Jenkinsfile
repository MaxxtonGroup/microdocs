def tag = input message: 'Tag', parameters: [string(defaultValue: '', description: 'Tag', name: 'TAG')]
node {
    stage('Checkout Git'){
        git url: 'git@github.com:MaxxtonGroup/microdocs.git', branch: 'master'
    }
    stage('Build microdocs-server'){
        dir ('microdocs-server'){
            sh 'npm install'
            sh 'npm version ' + tag
            sh 'npm run prepublish'
            sh 'cp .npmrc dist/.npmrc'
            dir ('dist'){
                sh 'npm install --prod'
            }
        }
    }
    stage('Build microdocs-ui'){
        dir ('microdocs-ui'){
            sh 'npm install'
            sh 'npm version ' + tag
            sh './node_modules/.bin/ng build --prod'
        }
    }
    stage('Build microdocs-ui'){
        dir ('microdocs-ui'){
            sh 'npm install'
            sh 'npm version ' + tag
            sh 'ng build --prod'
        }
    }
    stage('Build docker image'){
        sh 'bash docker rmi maxxton/microdocs:' + tag + ' || true'
        sh 'bash docker rmi maxxton/microdocs:latest || true'
        sh 'docker build --tag=maxxton/microdocs:' + tag + ' --no-cache .'
    }
    stage('Public docker image'){
        sh 'docker login --email $DOCKERHUB_EMAIL --username $DOCKERHUB_USERNAME --password $DOCKERHUB_PASSWORD'
        sh 'docker push maxxton/microdocs:' + tag;
        sh 'docker tag maxxton/microdocs:' + tag + ' maxxton/microdocs:latest'
        sh 'docker push maxxton/microdocs:latest'
    }
}