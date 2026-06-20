pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:latest'
            args '--shm-size=2g'
        }
    }

    options {
        ansiColor('xterm')
    }

    stages {
        stage('build') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('test') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('deploy') {
            steps {
                echo 'Mock deployment was successful!'
            }
        }
    }
}