WORKDIR /app

RUN apt-get update && apt-get add --no-cache nmap && \
    echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/community >> /etc/apt-get/repositories && \
    echo @edge https://dl-cdn.alpinelinux.org/alpine/edge/main >> /etc/apt-get/repositories && \
    apt-get update && \
    apt-get add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss \
      xvfb \
      xvfb-run

ENV PUPPETEER_SKIP_CHROMIMUM_DOWNLOAD=true \
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY . /app

RUN npm ci

EXPOSE 3000

CMD ["node", "render.js"]