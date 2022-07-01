/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as dotenv from 'dotenv';
dotenv.config();

export class Environment {
  gitlabHost?: string;
  gitlabToken: string;
  botToken: string;
  mrsChannelId: string;
  serverPort: number;
  logFile?: string;

  constructor() {
    ['GITLAB_TOKEN', 'BOT_TOKEN', 'MRS_CHANNEL_ID', 'DATABASE_URL'].forEach(
      (k) => {
        if (!process.env[k]) {
          throw new Error(
            `Key ${k} was not found in environment but is required`,
          );
        }
      },
    );

    this.gitlabHost = process.env.GITLAB_HOST;
    this.gitlabToken = process.env.GITLAB_TOKEN!;
    this.botToken = process.env.BOT_TOKEN!;
    this.mrsChannelId = process.env.MRS_CHANNEL_ID!;

    this.serverPort = parseInt(process.env.SERVER_PORT || '8080');
    this.logFile = process.env.LOG_FILE;
  }
}

export const env = new Environment();
