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

        stage('Node Version') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Auth Setup') {
            steps {
                bat 'npx playwright test --project=auth-setup'
            }
        }

        stage('Run API Tests') {
            steps {
                bat 'npx playwright test --project=api-test'
            }
        }

        stage('Run UI Tests') {
            steps {
                bat 'npx playwright test --project=chromium'
            }
        }

    }

    post {

        always {

            junit allowEmptyResults: true,
                  testResults: 'reports-e2e/junit.xml'

            archiveArtifacts(
                artifacts: '''
                    reports-e2e/**,
                    playwright-report/**,
                    test-results/**
                ''',
                allowEmptyArchive: true
            )
        }

        success {
            echo 'Playwright tests completed successfully.'
        }

        failure {
            echo 'Playwright tests failed.'
        }
    }
}