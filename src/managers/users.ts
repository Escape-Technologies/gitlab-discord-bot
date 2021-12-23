import airtableClient from '../utils/airtable-client';

export interface StoredUser {
  gitlabId: string;
  watchers: Set<string>;
  recordId: string;
}

export class UserManager {
  _store = new Map<string, StoredUser>();

  constructor() {
    airtableClient.getRecords().then((records) => {
      console.log('Initialized mapping');
      records.forEach((record) => {
        const { gitlabId, discordId } = record.fields as {
          gitlabId: string;
          discordId: string;
        };
        const stored = this._store.get(gitlabId);
        if (stored) {
          stored.watchers.add(discordId);
        } else {
          this._store.set(gitlabId, {
            gitlabId,
            recordId: record.id,
            watchers: new Set([discordId])
          });
        }
        console.log(`${discordId} <-> ${gitlabId} <-> ${record.id}`);
      });
    });
  }

  isWatching(gitlabId: string, discordId: string) {
    const stored = this._store.get(gitlabId);
    if (!stored) {
      return false;
    }
    return this._store.get(gitlabId)?.watchers.has(discordId);
  }

  async removeWatcher(gitlabId: string, discordId: string) {
    const stored = this._store.get(gitlabId);
    if (stored) {
      stored.watchers.delete(discordId);
      await airtableClient.deleteRecord(stored.recordId);
    }
  }

  async addWatcher(gitlabId: string, discordId: string) {
    const stored = this._store.get(gitlabId);
    if (stored) {
      stored.watchers.add(discordId);
    } else {
      const records = await airtableClient.writeRecord({
        gitlabId,
        discordId
      });
      this._store.set(gitlabId, {
        gitlabId,
        recordId: records[0].id,
        watchers: new Set([discordId])
      });
    }
  }

  async get(gitlabId: string): Promise<StoredUser | undefined> {
    const res = this._store.get(gitlabId);
    return res;
  }
}
