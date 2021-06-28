# Builder Stage
FROM node:14-alpine AS builder
WORKDIR /prmotion-service

COPY package.json lerna.json package-lock.json ./
COPY apps/api/ ./apps/api/

RUN npm ci --ignore-scripts
RUN npx lerna bootstrap -- --ignore-scripts
RUN npx lerna run --stream build

# Run stage
FROM node:14-alpine
WORKDIR /prmotion-service

COPY package.json package-lock.json lerna.json ./
RUN npm ci --ignore-scripts --production

# COPY content api node_modules and package json, built file
COPY --from=builder /prmotion-service/apps/api/ ./apps/api/

RUN npx lerna exec --concurrency 1 --stream -- "rm -rf node_modules"
RUN npx lerna bootstrap -- --ignore-scripts --production
