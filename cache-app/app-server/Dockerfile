FROM node:18-alpine

WORKDIR /srv

RUN npm install -g typescript
RUN npm install -g ts-node

COPY package.json .
COPY tsconfig.json . 

RUN npm i

COPY src/ src/

EXPOSE 3000
CMD [ "npx", "ts-node", "src/server.ts" ]