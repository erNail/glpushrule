import { Gitlab } from '@gitbeaker/rest';

const gitlabHost = process.env['GITLAB_HOST'];
const gitlabToken = process.env['GITLAB_TOKEN'];

if (gitlabHost === undefined) {
  throw new Error('GITLAB_HOST must be set');
}

if (gitlabToken === undefined) {
  throw new Error('GITLAB_TOKEN must be set');
}

const gitlabApi = new Gitlab({
  host: gitlabHost,
  token: gitlabToken,
});

export default gitlabApi;
