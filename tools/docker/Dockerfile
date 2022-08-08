FROM node:current-bullseye-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY yarn.lock .

RUN npm install --global serve && npm install

COPY public public
COPY src src
COPY .env .
COPY tsconfig.json .

RUN yarn build
