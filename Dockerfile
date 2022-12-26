
###################
# Build Stage
###################

FROM node:18.12 AS build

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN yarn install
RUN yarn build

###################
# Dependencies Stage
###################

FROM node:18.12 AS dependencies

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/

RUN yarn install --production=true

###################
# Production Stage
###################

FROM node:18.12-bullseye-slim

ENV NODE_ENV production

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init

USER node

WORKDIR /usr/src/app

COPY --chown=node:node --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist/ ./

EXPOSE 3000

CMD ["dumb-init", "node", "main.js"]