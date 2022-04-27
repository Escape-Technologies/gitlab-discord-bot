FROM node:16 as build

WORKDIR /build

COPY package.json package.json
COPY prisma prisma
RUN npm install

COPY tsconfig.json tsconfig.json
COPY src src

ENV NODE_ENV production
RUN npm run build
RUN npx prisma generate


FROM node:16 as production

WORKDIR /app
ENV NODE_ENV production

COPY package.json package.json
COPY prisma prisma
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules

EXPOSE 8080
CMD [ "npm", "start" ]