import { MergeRequest, Project, Repository } from 'app/libs/gitlab/dtos/common';
import { User } from 'discord.js';

export interface MrUpdateWebhookPayload {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: User;
  project: Project;
  object_attributes: MergeRequest;
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
