FROM node:11.15-slim

COPY index.js package.json package-lock.json /

RUN npm install

CMD npm run start
