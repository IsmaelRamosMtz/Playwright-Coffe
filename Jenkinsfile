pipeline {
    agent any

    options {
        ansiColor('xterm')
    }

    stages {
        stage('build') {
            agent {
                docker {
                    image 'node:22-bullseye-slim'
                    args '--user root:root'
                }
            }
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('test') {
            agent {
                docker {
                    image 'node:22-bullseye-slim'
                    reuseNode true
                }
            }
            steps {
                sh 'npx playwright test'
            }
        }

        stage('deploy') {
            agent {
                docker {
                    image 'alpine'
                }
            }
            steps {
                echo 'Mock deployment was successful!'
            }
        }
    }
}