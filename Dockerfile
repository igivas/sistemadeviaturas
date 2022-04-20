FROM node:lts-alpine as build
WORKDIR /src

COPY package*.json ./
RUN yarn install --prod

COPY ./ .

ENV NODE_ENV=development

EXPOSE 4003

CMD [ "node", "dist/server.js" ]
