import {
  MergeRequest,
  Project,
  Repository,
  User,
} from 'app/libs/gitlab/dtos/common';

export interface MrApprovedWebhookPayload {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: User;
  project: Project;
  object_attributes: MergeRequest;
  repository: Repository;
  assignees?: User[];
}
