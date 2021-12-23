import { Gitlab } from '@gitbeaker/node';
import { env } from './environment';

const client = new Gitlab({
  token: env.gitlabToken
});
export default client;
