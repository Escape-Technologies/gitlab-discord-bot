# Gitlab discord bot

A Discord bot able to track several updates (like merge requests, notes, approvals) on a Gitlab project, and send those updates to a discord channel.

It can also notify you in a private channel for updates regarding a specific user on Gitlab.

````=txt
DATABASE_URL="postgresql://postgres:password@localhost:5432/bot?schema=public"
GITLAB_TOKEN=<Your gitlab API key>
GITLAB_PROJECT_ID=<The id of the gitlab project to track>
SERVER_PORT=<The port on which the server should listen, defaults to 8080>
BOT_TOKEN=<Your discord token>
MRS_CHANNEL_ID=<The id in discord of the channel receiving messages for MRs>
````

## Build

**Important note on intents**
The bot needs specific intents to run, correctly, you will need to grant the following intents on this page as well:
- `Presence Intent`
- `Server Members Intent`
- `Message Content Intent`

### `MRS_CHANNEL_ID`
After enabling the [application test mode](https://discord.com/developers/docs/game-sdk/store#application-test-mode), you just have to roght-click on a channel, and select `Copy Id`


## Add the bot to your server
Go to [this page](https://discord.com/oauth2/authorize?client_id=920025554126794772&permissions=19456&scope=bot%20applications.commands) and select the server on which you want the bot to participate, and authorize it.

## Commands
### `yarn dev`
Starts a local development server, with hot reload, listening either on the sport specified by `$SERVER_PORT`, or on port 8080.

### `yarn build`
Transpiles the TS code inside of the `src` folder into JS code, into the `dist` folder.

### `yarn start`
Starts the build version of the code, by running `node dist/main.js`.

### `Build the docker container`
This builds the container in a local image named `bot-local`

`docker build -t discord-bot -f Dockerfile .`

### `Run the docker container`
This runs the local image named of `discord-bot`, using the environment specified in `.env`

**Please make sure that the ports binding matches the port specified in the `.env` file !**

`docker run --env-file .env -d -p 4566:4566 --network host  discord-bot`
