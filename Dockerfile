FROM node:12-slim

RUN mkdir /app
COPY index.js package.json package-lock.json /app/

VOLUME /app
WORKDIR /app

RUN npm install \
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

CMD npm run start
