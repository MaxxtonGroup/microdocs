def tag = input message: 'Tag', parameters: [string(defaultValue: '', description: 'Tag', name: 'TAG')]
node {
    stage('Checkout Git'){
        checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, submoduleCfg: [], userRemoteConfigs: [[url: 'https://github.com/MaxxtonGroup/microdocs', branch: 'master']]])

        //git url: 'git@github.com:MaxxtonGroup/microdocs.git', branch: 'master'
        stash name: 'source'
    }
    stage('Build microdocs-server'){
        unstash name: 'source'
        dir ('microdocs-server'){
            sh 'npm install'
            sh 'npm version ' + tag
            sh 'npm run prepublish'
            sh 'cp .npmrc dist/.npmrc'
            dir ('dist'){
                sh 'npm install --prod'
                stash name: 'server-dist'
            }
        }
    }
    stage('Build microdocs-ui'){
        unstash name: 'source'
        dir ('microdocs-ui'){
            sh 'npm install'
            sh 'npm version ' + tag
            sh './node_modules/.bin/ng build --prod'
            dir('dist') {
                stash name: 'ui-dist'
            }
        }
    }

    stage('Build docker image'){
        unstash name: 'source'
        unstash name: 'server-dist'
        unstash name: 'ui-dist'

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