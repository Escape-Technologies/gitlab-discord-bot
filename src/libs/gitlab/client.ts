import { Gitlab } from '@gitbeaker/node';
import { env } from 'app/libs/environment';

export class GitlabClient extends Gitlab {}

export const gitlabClient = new GitlabClient({
  token: env.gitlabToken,
  host: env.gitlabHost,
});
