FROM node:15-alpine as builder

# Needed for node-gyp modules
RUN apk --no-cache add python make g++

WORKDIR /usr/src/app

RUN mkdir -p ./node_modules && chown -R node:node ./

COPY package*.json ./

USER node

COPY --chown=node:node . .

RUN npm run build

FROM node:15-alpine

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

USER node

WORKDIR /usr/src/app

COPY --from=builder --chown=node:node /usr/src/app/node_modules node_modules
COPY --from=builder --chown=node:node /usr/src/app/dist dist
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./

CMD [ "npm", "run", "start:prod" ]

EXPOSE 3000
