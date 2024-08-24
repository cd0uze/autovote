FROM ghcr.io/puppeteer/puppeteer:22.15.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

    ENV TERM linux

WORKDIR /usr/src/app

COPY package*.json ./
RUN apt-get install xvfb && npm ci
COPY . .
CMD [ "node", "index.js" ]