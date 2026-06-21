pipeline {

    agent any

    environment {
        CI = 'true'
        BASE_URL = 'https://valentinos-magic-beans.click/'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Debug') {
            steps {
                sh 'which node || true'
                sh 'which npm || true'
                sh 'which npx || true'
                sh 'node -v'
                sh 'npm -v'
                sh 'npx -v'
                sh 'echo $PATH'
            }
        }

        stage('Verify Environment') {
            steps {
                sh 'pwd'
                sh 'node -v'
                sh 'npm -v'
                sh 'npx -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                sh 'npx playwright install chromium'
            }
        }

        stage('Auth Setup') {
            steps {
                sh 'npx playwright test --project=auth-setup'
            }
        }

        stage('API Tests') {
            steps {
                sh 'npx playwright test --project=api-test'
            }
        }

        stage('UI Tests') {
            steps {
                sh 'npx playwright test --project=chromium'
            }
        }
    }

    post {

        always {
            junit allowEmptyResults: true,
                  testResults: 'reports-e2e/junit.xml'

            archiveArtifacts(
                artifacts: 'reports-e2e/**/*',
                allowEmptyArchive: true
            )
        }
    }
}