import {
  MergeRequest,
  Project,
  Repository,
  User,
} from 'app/libs/gitlab/dtos/common';

export interface MrClosedWebhookPayload {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: User;
  project: Project;
  object_attributes: MergeRequest;
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
