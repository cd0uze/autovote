FROM ghcr.io/puppeteer/puppeteer:22.15.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR cdouze@cdouze:~/autovote

CMD [ "node", "index.js" ]