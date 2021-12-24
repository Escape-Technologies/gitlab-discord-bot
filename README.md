# Gitlab-Discord bot

The V2 of the discord bot

## Get started
The bot works out-of-the-box, however, you need some configuration for it.

````=txt
GITLAB_TOKEN=<Your gitlab API key>
BOT_TOKEN=<Your discord token>
MRS_CHANNEL_ID=<The id in discord of the channel receiving messages for MRs>
GITLAB_PROJECT_ID=<The id of the project watched in Gitlab>
AIRTABLE_CONFIG=<The variables used to connect to the airtable API under the format base:apiKey:tableName>
SERVER_PORT=4556
````

### `GITLAB_TOKEN`

To get one, go to your [user's access token settings page](https://gitlab.com/-/profile/personal_access_tokens) and generate the token. It will be **attached to your own gitlab account** and is used to fetch data from the repository.

### `BOT_TOKEN`
To get one, go the [discord developer portal](https://discord.com/developers/applications) and create an application, then a bot. On your application, under the `bot` menu, click on *Click to reveal token* and copy paste this value.

**Important note on intents**
The bot needs specific intents to run, correctly, you will need to grant the following intents on this page as well:
- `Presence Intent`
- `Server Members Intent`
- `Message Content Intent`

### `MRS_CHANNEL_ID`
After enabling the [application test mode](https://discord.com/developers/docs/game-sdk/store#application-test-mode), you just have to roght-click on a channel, and select `Copy Id`

### `GITLAB_PROJECT_ID`
You can copy this id from the homepage of your project on Gitlab.

### `AIRTABLE_CONFIG`
In order for persistence to be active, the bot connects onto an Airtable page. More adapter will be developed in the future and this process will be standardized so that you can develop your own adapters.

As of now, you need to provide three elements for the bot to conect to airtable. You can find them in the [dynamic documentation provided by Airtable on your tables](https://airtable.com/api).

`base`, `apiKey`, and `tableName` can provided by the dynamic documentation on this snippet:
````js
var base = new Airtable({apiKey: $apiKey}).base($base);
base($tableName)
````


## Add the bot to your server
Go to [this page](https://discord.com/oauth2/authorize?client_id=920025554126794772&permissions=19456&scope=bot%20applications.commands) and select the server on which you want the bot to participate, and authorize it.

## Commands
### `npm run start:dev`
Starts a local development server, with hot reload, listening either on the sport specified by `$SERVER_PORT`, or on port 8080.

### `npm run build`
Transpiles the TS code inside of the `src` folder into JS code, into the `dist` folder.

### `npm run start`
Starts the build version of the code, by running `node dist/main.js`.

### `Build the docker container`
This builds the container in a local image named `bot-local`

`docker build -t bot-local -f docker/Dockerfile .`

### `Run the docker container`
This runs the local image named of `bot-local`, using the environment specified in `.env`

**Please make sure that the ports binding matches the port specified in the `.env` file !**

`docker run --env-file .env -d -p 4566:4566 bot-local`