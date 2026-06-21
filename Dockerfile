FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y curl gnupg2 ca-certificates \
 && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
 && apt-get install -y nodejs \
 && npm install -g npm@latest \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

USER jenkins

*/ pass fb821669b317448792c3bb4c7621c30d */