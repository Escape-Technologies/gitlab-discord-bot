/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as dotenv from 'dotenv';
dotenv.config();

export class Environment {
  gitlabToken: string;
  botToken: string;
  botPort?: number;
  mrsChannelId: string;
  gitlabProjectsIds: number[];
  airtableAPIKey: string;
  airtableUrl: string;

  constructor() {
    [
      'GITLAB_TOKEN',
      'BOT_TOKEN',
      'MRS_CHANNEL_ID',
      'GITLAB_PROJECT_IDS',
      'AIRTABLE_API_KEY',
      'AIRTABLE_URL'
    ].forEach((k) => {
      if (!process.env[k]) {
        throw new Error(
          `Key ${k} was not found in environment but is required`
        );
      }
    });
    this.gitlabToken = process.env.GITLAB_TOKEN!;
    this.botToken = process.env.BOT_TOKEN!;
    this.botPort = parseInt(process.env.DISCORD_BOT_PORT!);
    this.mrsChannelId = process.env.MRS_CHANNEL_ID!;
    this.airtableAPIKey = process.env.AIRTABLE_API_KEY!;
    this.airtableUrl = process.env.AIRTABLE_URL!;
    this.gitlabProjectsIds = process.env
      .GITLAB_PROJECT_IDS!.split(',')
      .map((pi) => parseInt(pi));
  }
}

export const env = new Environment();
