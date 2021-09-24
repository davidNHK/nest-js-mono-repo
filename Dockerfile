# Builder Stage
FROM node:16.10.0-alpine3.13 AS builder

WORKDIR /usr/src/prmotion-service

COPY . ./

RUN npm ci --ignore-scripts && \
    npx lerna bootstrap -- --ignore-scripts && \
    npx lerna run --stream build

# Run stage
FROM node:16.10.0-alpine3.13

WORKDIR /usr/src/prmotion-service

COPY package.json package-lock.json lerna.json ./

RUN apk add dumb-init

# COPY content api node_modules and package json, built file
COPY --from=builder /usr/src/prmotion-service/apps/api/ ./apps/api/

USER node