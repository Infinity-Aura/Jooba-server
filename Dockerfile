FROM node:20.12.2-alpine3.18

RUN npm install -g pnpm

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

RUN pnpm prune --prod
