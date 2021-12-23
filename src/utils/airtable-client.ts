import { env } from './environment';
import Airtable, { FieldSet, Table } from 'airtable';
export interface UserMappingRecord {
  gitlabId: string;
  discordId: string;
}

export interface AirtableRecords {
  id: string;
  fields: UserMappingRecord;
  createdTime: string;
}

class AirtableClient {
  table: Table<FieldSet>;

  constructor(base: string, apiKey: string, table: string) {
    this.table = new Airtable({ apiKey }).base(base)(table);
  }

  async writeRecord(user: UserMappingRecord) {
    return await this.table.create([{ fields: { ...user } }]);
  }

  async deleteRecord(id: string) {
    await this.table.destroy([id]);
  }

  async getRecords(formula?: string) {
    const query = formula ? { filterByFormula: formula } : {};

    try {
      return await this.table.select(query).all();
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

export default new AirtableClient(
  env.airtableBase,
  env.airtableApiKey,
  env.airtableTable
);
