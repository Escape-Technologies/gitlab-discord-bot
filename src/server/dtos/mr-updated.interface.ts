interface User {
  id: number;
  name: string;
  username: string;
  avatar_url: string;
  email: string;
}

interface Project {
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

export interface MrUpdateWebhookPayload {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: User;
  project: Project;
  object_attributes: {
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
    source: any;
    target: any;
    last_commit: any;
    work_in_progress: boolean;
    total_time_spent: number;
    time_change: number;
    human_total_time_spent?: number;
    human_time_change?: number;
    human_time_estimate?: number;
    assignee_ids: number[];
    state: string;
    blocking_discussions_resolved: boolean;
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
  repository: {
    name: string;
    url: string;
    description: string;
    homepage: string;
  };
  assignees?: User[];
}
