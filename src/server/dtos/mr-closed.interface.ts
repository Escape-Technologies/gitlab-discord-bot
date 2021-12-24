import { Branch, Commit, Project, Repository, User } from './common';

export interface MrClosedWebhookPayload {
  object_kind: 'merge_request';
  event_type: 'merge_request';
  user: User;
  project: Project;
  object_attributes: {
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
    state: 'closed';
    blocking_discussions_resolved: boolean;
    action: 'close';
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
