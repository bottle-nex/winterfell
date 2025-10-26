export enum GITHUB_WORKER_QUEUE_TYPES {
    GITHUB_EXPORT = 'GITHUB_EXPORT'
}

export interface GithubPushJobData {
  github_access_token: string;
  owner: string;
  repo_name: string;
  user_id: string;
  contract_id: string;
}

export interface FileContent {
    path: string;
    content: string;
}