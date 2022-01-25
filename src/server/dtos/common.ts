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
  head_pipeline_id?: string;
  id: number;
  iid: number;
  last_edited_at: string;
  last_edited_by_id: number;
  merge_commit_sha?: string;
  merge_error?: any;
  merge_params: any;
  merge_status: string;
  merge_user_id?: number;
  merge_when_pipeline_succeeds: boolean;
  milestone_id?: number;
  source_branch: string;
  source_project_id: number;
  state_id: number;
  target_branch: string;
  target_project_id: number;
  time_estimate: number;
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
  human_total_time_spent?: number;
  human_time_change?: number;
  human_time_estimate?: number;
  blocking_discussions_resolved: boolean;
  state: string;
}
