import { BuildStatus } from "@repo/database";

export interface BuildCacheCheck {
  isCached: boolean;
  codeHash: string | null;
  lastBuildStatus?: BuildStatus;
  lastBuildAt?: Date;
  buildJobId?: string;
  canReuseBuild: boolean;
}

export enum COMMAND {
  WINTERFELL_BUILD = "WINTERFELL_BUILD",
  WINTERFELL_TEST = "WINTERFELL_TEST",
  WINTERFELL_DEPLOY_DEVNET = "WINTERFELL_DEPLOY_DEVNET",
  WINTERFELL_DEPLOY_MAINNET = "WINTERFELL_DEPLOY_MAINNET",
  WINTERFELL_VERIFY = "WINTERFELL_VERIFY",
}

export interface BaseJobPayload {
  jobId: string;
  contractId: string;
  contractName: string;
  userId: string;
  timestamp: number;
  retryCount?: number;
}

export interface BuildJobPayload extends BaseJobPayload {
  command: COMMAND;
}
