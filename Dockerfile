# Builder Stage
FROM node:14.17.1-alpine3.11 AS builder

WORKDIR /usr/src/prmotion-service

COPY . ./

RUN npm ci --ignore-scripts && \
    npx lerna bootstrap -- --ignore-scripts && \
    npx lerna run --stream build

# Run stage
FROM node:14.17.1-alpine3.11

WORKDIR /usr/src/prmotion-service

COPY package.json package-lock.json lerna.json ./

RUN apk add dumb-init

# COPY content api node_modules and package json, built file
COPY --from=builder /usr/src/prmotion-service/apps/api/ ./apps/api/

USER node