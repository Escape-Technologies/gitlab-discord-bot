import {
  MergeRequest,
  Note,
  Project,
  Repository,
  User,
} from 'app/libs/gitlab/dtos/common';

export interface NoteReceivedWebhookPayload {
  object_kind: 'note';
  event_type: 'note';
  user: User;
  project_id: number;
  project: Project;
  repository: Repository;
  merge_request: MergeRequest;
  object_attributes: Note;
}
