FROM node:latest
RUN npm config set registry https://registry.npmjs.org/
RUN npm cache clean --force

 RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    apt-transport-https \
    xvfb \
    && rm -rf /var/lib/apt/lists/*

FROM ghcr.io/puppeteer/puppeteer:22.15.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
     NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "render.js" ]