FROM ghcr.io/puppeteer/puppeteer:22.15.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

run sudo apt-get install xvfb

COPY package*.json ./
RUN npm ci
COPY . .
CMD [ "node", "index.js" ]