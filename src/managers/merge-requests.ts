import { env } from '../utils/environment';
import gitlabClient from '../utils/gitlab-client';

export interface StoredMr {
  id: number;
  state: string;
  title: string;
  draft: boolean;
  assignees: string[];
  reviewers: string[];
}

export class MrManager {
  _store = new Map<number, StoredMr>();

  constructor() {
    this.initStore();
  }

  async initStore() {
    const projectMrs = await gitlabClient.MergeRequests.all({
      projectId: env.gitlabProjectId
    });
    projectMrs.forEach((mr) => {
      const reviewers: string[] =
        mr.reviewers?.map((r) => r.username as string) || [];
      const assignees: string[] =
        mr.assignees?.map((r) => r.username as string) || [];

      this.store(mr.id, {
        id: mr.id,
        state: mr.state,
        title: mr.title,
        draft: mr.title.includes('Draft:'),
        reviewers,
        assignees
      });
    });
  }

  store(k: number, v: StoredMr) {
    console.log('storing mr with id', v.id, `"${v.title}"`);
    this._store.set(k, v);
  }

  get(k: number) {
    return this._store.get(k);
  }
}
