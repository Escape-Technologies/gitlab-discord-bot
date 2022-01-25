import { MergeRequest, Project, Repository, User } from './common';

export interface MrOpenedWebhookPayload {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: User;
  project: Project;
  object_attributes: MergeRequest & {
    state: 'opened';
    action: 'open' | 'reopen';
  };
  labels: any[];
  changes: {
    state_id: {
      previous: number;
      current: number;
    };
    updated_at: {
      previous: string;
      current: string;
    };
  };
  repository: Repository;
  assignees?: User[];
}
