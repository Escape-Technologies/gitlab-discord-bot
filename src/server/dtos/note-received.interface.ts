import { MergeRequest, Project, Repository, User } from './common';

interface LineRange {
  line_code: string;
  type: string;
  old_line: number;
  new_line?: number;
}

interface ChangePosition {
  base_sha?: string;
  start_sha?: string;
  head_sha?: string;
  old_path?: string;
  new_path?: string;
  position_type: string;
  old_line?: number;
  new_line?: number;
  line_range?: {
    start: LineRange;
    end: LineRange;
  };
}

export interface Note {
  attachment?: any;
  author_id: number;
  change_position: ChangePosition;
  commit_id?: string;
  created_at: string;
  discussion_id: string;
  id: number;
  line_code: string;
  note: string;
  noteable_id: number;
  noteable_type: string;
  original_position: ChangePosition;
  position: ChangePosition;
  project_id: number;
  resolved_at?: string;
  resolved_by_id?: number;
  resolved_by_push?: boolean;
  st_diff: null;
  system: boolean;
  type: 'DiffNote';
  updated_at: string;
  updated_by_id?: number;
  description: string;
  url: string;
}

export interface NoteReceivedWebhookPayload {
  object_kind: 'note';
  event_type: 'note';
  user: User;
  project_id: number;
  project: Project;
  object_attributes: Note;
  repository: Repository;
  merge_request: MergeRequest;
}
