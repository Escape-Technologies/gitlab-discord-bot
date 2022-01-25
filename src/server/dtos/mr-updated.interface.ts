import { User } from 'discord.js';
import { MergeRequest, Project, Repository } from './common';

export interface MrUpdateWebhookPayload {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: User;
  project: Project;
  object_attributes: MergeRequest & {
    action: 'update';
  };
  labels: any[];
  changes: {
    assignees?: { previous: User[]; current: User[] };
    title?: {
      previous: string;
      current: string;
    };
  };
  repository: Repository;
  assignees?: User[];
}
