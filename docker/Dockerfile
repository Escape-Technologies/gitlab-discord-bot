FROM golang AS envsubst
RUN go install github.com/a8m/envsubst/cmd/envsubst@latest

FROM node:16-alpine as build

WORKDIR /build
COPY package*.json ./
RUN npm ci

COPY tsconfig.json tsconfig.json
COPY src src
RUN npm run build

FROM node:16-alpine as production

WORKDIR /app
ENV NODE_ENV production
ENV LANGUAGE nodejs
ENV SERVICE discord-bot

RUN apk add libc6-compat
COPY --from=envsubst /go/bin/envsubst /usr/local/bin/
COPY --from=grafana/promtail /usr/bin/promtail /usr/local/bin/
COPY --from=grafana/carbon-relay-ng /bin/carbon-relay-ng /bin/carbon-relay-ng
COPY --from=grafana/carbon-relay-ng /etc/ca-certificates.conf /etc/ca-certificates.conf
COPY --from=grafana/carbon-relay-ng /etc/ssl/certs /etc/ssl/certs

COPY package*.json ./
COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules

COPY docker/metrics/ /etc/
COPY docker/entrypoint.sh /app/

EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]
CMD [ "npm", "start" ]