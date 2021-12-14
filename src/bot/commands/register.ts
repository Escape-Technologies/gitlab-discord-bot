import axios from 'axios';
import { CommandResult } from '.';
import { env } from '../../utils/environment';

export interface UserMappingRecord {
  gitlabId: string;
  discordId: string;
}

interface AirtableRecords {
  records: {
    id: string;
    fields: UserMappingRecord;
    createdTime: string;
  }[];
}

export async function register(
  discordId: string,
  gitlabId: string
): Promise<CommandResult> {
  const { data } = await axios.get<AirtableRecords>(env.airtableUrl, {
    headers: {
      Authorization: `Bearer ${env.airtableAPIKey}`
    }
  });
  const existingRecord = data.records.find(
    (record) =>
      record.fields.discordId === discordId &&
      record.fields.gitlabId === gitlabId
  );
  if (existingRecord) {
    return { error: `You are already watching \`${gitlabId}\`` };
  }
  try {
    await axios.post<AirtableRecords>(
      env.airtableUrl,
      {
        records: [
          {
            fields: {
              discordId: discordId,
              gitlabId: gitlabId
            }
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${env.airtableAPIKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch {
    return { error: `Registration of \`${gitlabId}\` failed.` };
  }
  return { result: { message: `Succesfully registered \`${gitlabId}\`` } };
}
