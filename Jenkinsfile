node {
    stage('Checkout Git'){
        git url: 'git@github.com:MaxxtonGroup/microdocs.git', branch: 'development'
        stash name: 'source'
    }
    stage('Build microdocs-core'){
        unstash 'source'
        dir ('microdocs-core-ts'){
            sh 'echo  "Installing npm dependencies"'
            sh 'npm version $TAG'
            sh 'npm install'
            sh 'echo "Publishing to private NPM registry"'
            sh 'npm run prepublish'
            dir ('dist'){
                stash name: 'microdocs-core-dist'
            }
        }
    }
    stage('Publish microdocs-core'){
        unstash 'microdocs-core-dist'
        dir ('microdocs-core-ts'){
            try{
                sh 'npm unpublish @maxxton/microdocs-core@$TAG'
            }catch(Exception e){}
            sh 'npm publish dist'
        }
    }
    stage('Build microdocs-cli'){
        unstash 'source'
        dir ('microdocs-cli'){
            sh 'echo  "Installing npm dependencies"'
            sh 'npm version $TAG'
            sh 'npm install --save @maxxton/microdocs-core@$TAG'
            sh 'npm install'
            sh 'echo "Publishing to private NPM registry"'
            sh 'npm run prepublish'
            dir ('dist'){
                stash name: 'microdocs-cli-dist'
            }
        }
    }
    stage('Publish microdocs-cli'){
        unstash 'microdocs-cli-dist'
        dir ('microdocs-cli') {
            try{
                sh 'npm unpublish @maxxton/microdocs-cli@$TAG'
            }catch(Exception e){}
            sh 'npm publish'
        }
    }
    stage('Build microdocs-server'){
        unstash 'source'
        dir ('microdocs-server'){
            sh 'echo  "Installing npm dependencies"'
            sh 'npm version $TAG'
            sh 'npm install --save @maxxton/microdocs-core@$TAG'
            sh 'npm install'
            sh 'echo "Publishing to private NPM registry"'
            sh 'npm run package-distribution'
            sh 'cp .npmrc dist/.npmrc'
            dir ('dist'){
                sh 'npm install --prod'
                stash name: 'microdocs-server-dist'
            }
        }
    }
    stage('Build microdocs-ui'){
        unstash 'source'
        dir ('microdocs-ui'){
            sh 'echo  "Installing npm dependencies"'
            sh 'npm version $TAG'
            sh 'npm install --save @maxxton/microdocs-core@$TAG'
            sh 'npm install @maxxton/gulp-builder@2.3.3 --save-dev'
            sh 'npm install'
            sh 'echo "Publishing to private NPM registry"'
            sh 'npm run package-distribution'
            dir ('dist'){
                stash name: 'microdocs-ui-dist'
            }
        }
    }
    stage('Build docker image'){
        unstash 'source'
        unstash 'microdocs-server-dist'
        unstash 'microdocs-ui-dist'
        sh 'bash docker rmi maxxton/microdocs:$TAG || true'
        sh 'bash docker rmi maxxton/microdocs:latest || true'
        sh 'docker build --tag=maxxton/microdocs:$TAG --no-cache .'
    }
    stage('Public docker image'){
        sh 'docker login --email $DOCKERHUB_EMAIL --username $DOCKERHUB_USERNAME --password $DOCKERHUB_PASSWORD'
        sh 'docker push maxxton/microdocs:$TAG'
        sh 'docker tag maxxton/microdocs:$TAG maxxton/microdocs:latest'
        sh 'docker push maxxton/microdocs:latest'
    }
}