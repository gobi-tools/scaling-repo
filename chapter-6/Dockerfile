FROM node:18-alpine

WORKDIR /srv

RUN npm install -g typescript
RUN npm install -g ts-node

COPY package.json .
COPY tsconfig.json . 

RUN npm i

COPY monitoring.ts monitoring.ts
COPY server.ts server.ts

EXPOSE 3000
CMD [ "npx", "ts-node", "server.ts" ]