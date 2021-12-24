FROM node:16-alpine as build

WORKDIR /build
COPY package*.json ./
RUN npm ci

COPY tsconfig.json tsconfig.json
COPY src src
ENV NODE_ENV production
RUN npm run build

FROM node:16-alpine as production

WORKDIR /app
ENV NODE_ENV production

COPY package*.json ./
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules

EXPOSE 8080
CMD [ "npm", "start" ]