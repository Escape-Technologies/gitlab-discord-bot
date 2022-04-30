# Configuration

This bot allows you to connect your Gitlab VCS to a Discord server. Thus, you need to provide it with a valid access to both your repository and your Gitlab server.

## Environment example

````=txt
DATABASE_URL="postgresql://postgres:password@localhost:5432/bot?schema=public"
GITLAB_TOKEN=<Your gitlab API key>
SERVER_PORT=<The port on which the server should listen, defaults to 8080>
BOT_TOKEN=<Your discord token>
MRS_CHANNEL_ID=<The id in discord of the channel receiving messages for MRs>
````

## `DATABASE_URL`

The url to your database. The bot is currently compatible with `PostgresSQL` only.

## `GITLAB_TOKEN`

The access token you retrieved from Gitlab. See [setting up an access token from Gitlab](./requirements.md#gitlab-access-token).

## `SERVER_PORT`

The port on which the server should listen, defaults to `8080`.

## `BOT_TOKEN`

The token you retrieved while [creating your discord application](./requirements.md#discord-application), it is used by Discord to authenticate the connections to their API initiated by the bot server.

## `MRS_CHANNEL_ID`

The ID of the discord channel where common messages are sent. It has to be part of a server where the bot has been invited (see [inviting the bot to your discord server](./requirements.md#add-the-bot-to-your-discord-server)).

1. Enable the [developper mode for your Discord application](https://discord.com/developers/docs/game-sdk/store#application-test-mode)
2. Right-click on a channel and click `Copy ID`

**[Next: Development & contributions](./development.md)**

**[Go back to documentation homepage](../README.md)**
