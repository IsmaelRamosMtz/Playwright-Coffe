pipeline {
    agent any

    options {
        ansiColor('xterm')
    }

    stages {
        stage('build') {
            steps {
                echo 'Step 1: Building the application...'
            }
        }

        stage('test') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.60.0-jammy'
                    reuseNode true
                }
            }
            steps {
                echo 'Step 2: Running tests in a Playwright Docker container...'
            }
        }

        stage('deploy') {
            steps {
                sh 'npx playwright test'
                echo 'Mock deployment was successful!'
            }
        }
    }
}