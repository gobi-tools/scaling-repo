FROM node:18-alpine

WORKDIR /srv

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY server.js server.js

EXPOSE 3000
CMD [ "npm", "run", "start" ]