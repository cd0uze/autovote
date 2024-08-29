WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y
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