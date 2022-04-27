export interface User {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  web_url: string;
  avatar_url?: string;
  git_ssh_url: string;
  git_http_url: string;
  namespace: string;
  visibility_level: number;
  path_with_namespace: string;
  default_branch: string;
  ci_config_path: string;
  homepage: string;
  url: string;
  ssh_url: string;
  http_url: string;
}

export interface Commit {
  id: string;
  message: string;
  title: string;
  timestamp: string;
  url: string;
  author: {
    name: string;
    email: string;
  };
}

export interface Repository {
  name: string;
  url: string;
  description: string;
  homepage: string;
}

export interface Branch {
  id: number;
  name: string;
  description: string;
  web_url: string;
  avatar_url?: string;
  git_ssh_url: string;
  git_http_url: string;
  namespace: string;
  visibility_level: 0;
  path_with_namespace: string;
  default_branch: string;
  ci_config_path: string;
  homepage: string;
  url: string;
  ssh_url: string;
  http_url: string;
}

export interface MergeRequest {
  assignee_ids?: number[];
  assignee_id?: number;
  author_id: number;
  created_at: string;
  description: string;
  head_pipeline_id?: number;
  id: number;
  iid: number;
  last_edited_at: string;
  last_edited_by_id: number;
  merge_commit_sha?: string;
  merge_error?: any; // Todo : specify this
  merge_params: any;
  merge_status: string;
  merge_user_id?: number;
  merge_when_pipeline_succeeds: boolean;
  milestone_id?: number;
  state_id: number;
  source_branch: string;
  source_project_id: number;
  target_branch: string;
  target_project_id: number;
  title: string;
  updated_at: string;
  updated_by_id: number;
  url: string;
  source: Branch;
  target: Branch;
  last_commit: Commit;
  work_in_progress: boolean;
  total_time_spent: number;
  time_change: number;
  time_estimate: number;
  human_total_time_spent?: number;
  human_time_change?: number;
  human_time_estimate?: number;
  state: string;
  blocking_discussions_resolved: boolean;
  action: 'open' | 'reopen' | 'update' | 'close';
}

export interface LineRange {
  start: {
    line_code: string;
    type: 'new';
    old_line: string | null;
    new_line: number | null;
  };
  end: {
    line_code: string;
    type: 'new';
    old_line: number | null;
    new_line: number | null;
  };
}

export interface NotePosition {
  base_sha: string | null;
  start_sha: string | null;
  head_sha: string | null;
  old_path: string | null;
  new_path: string | null;
  position_type: 'text';
  old_line: string | null;
  new_line: number;
  line_range: LineRange | null;
}

export interface Note {
  attachment: any | null;
  author_id: number;
  change_position: NotePosition | null;
  commit_id: number | null;
  created_at: string;
  discussion_id: string;
  id: number;
  line_code: string | null;
  note: string;
  noteable_id: number;
  noteable_type: 'MergeRequest';
  original_position: NotePosition | null;
  position: NotePosition | null;
  project_id: number;
  resolved_at: string | null;
  resolved_by_id: string | null;
  resolved_by_push: string | null;
  st_diff: any | null;
  system: boolean;
  type: 'DiscussionNote' | 'DiffNote' | 'Note' | null;
  updated_at: string;
  updated_by_id: number | null;
  description: string;
  url: string;
}
