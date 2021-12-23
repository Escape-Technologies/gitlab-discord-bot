export interface StoredMr {
  id: number;
  state: string;
  title: string;
  draft: boolean;
}

export class MrManager {
  _store = new Map<number, StoredMr>();

  store(k: number, v: StoredMr) {
    this._store.set(k, v);
  }

  get(k: number): StoredMr {
    const res = this._store.get(k);
    if (!res) {
      throw new Error(`Mr manager does not have any item with key ${k}`);
    }
    return res;
  }
}
