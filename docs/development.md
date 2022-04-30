# Contributing

The bot is open source and any contribution is warmly welcome !

In order to develop on this piece of code, you will have to setup a local instance of the bot.

## Clone the repository or fork it

```=sh
git clone git@github.com:Escape-Technologies/gitlab-discord-bot.git
```

## Create your `.env` file

See [configuring the bot](./requirements.md)

## Run the local bot development server

```=sh
yarn && yarn dev
```

## Forward gitlab webhooks to your localhost

For your local copy of the bot to react to gitlab webhooks, you need to provide gitlab with a url pointing to your local server. To do so, you can use tools like [ngrok](https://ngrok.com/) that can provide https URLs pointing to local ports of your machine.

## Commands

### `yarn dev`

Starts a local development server, with hot reload, listening either on the sport specified by `$SERVER_PORT`, or on port 8080.

### `yarn build`

Transpiles the TS code inside of the `src` folder into JS code, into the `dist` folder.

### `yarn start`

Starts the build version of the code, by running `node dist/main.js`.

### `Build the docker container`

This builds the container in a local image named `bot-local`

```=sh
docker build -t discord-bot -f Dockerfile .
```

### `Run the docker container`

This runs the local image named of `discord-bot`, using the environment specified in `.env`

**Please make sure that the ports binding matches the port specified in the `.env` file !**

```=sh
docker run --env-file .env -d -p 4566:4566 --network host  discord-bot
```

**[Go back to documentation homepage](../README.md)**
