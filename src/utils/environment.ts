/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as dotenv from 'dotenv';
dotenv.config();

export class Environment {
  gitlabToken: string;
  botToken: string;
  mrsChannelId: string;
  gitlabProjectId: number;
  airtableApiKey: string;
  airtableTable: string;
  airtableBase: string;
  serverPort: number;

  constructor() {
    [
      'GITLAB_TOKEN',
      'BOT_TOKEN',
      'MRS_CHANNEL_ID',
      'GITLAB_PROJECT_ID',
      'AIRTABLE_CONFIG'
    ].forEach((k) => {
      if (!process.env[k]) {
        throw new Error(
          `Key ${k} was not found in environment but is required`
        );
      }
    });
    this.gitlabToken = process.env.GITLAB_TOKEN!;
    this.botToken = process.env.BOT_TOKEN!;
    this.mrsChannelId = process.env.MRS_CHANNEL_ID!;

    const airtableConfig = process.env.AIRTABLE_CONFIG!.split(':');
    if (airtableConfig.length !== 3) {
      throw new Error(
        'Invalid Airtable config provided. Expected format is <base>:<apiKey>:<tableName>'
      );
    }
    this.airtableBase = airtableConfig[0];
    this.airtableApiKey = airtableConfig[1];
    this.airtableTable = airtableConfig[2];
    this.gitlabProjectId = parseInt(process.env.GITLAB_PROJECT_ID!);
    this.serverPort = parseInt(process.env.SERVER_PORT || '3000');
  }
}

export const env = new Environment();
