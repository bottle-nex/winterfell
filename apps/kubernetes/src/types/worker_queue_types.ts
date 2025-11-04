export enum WORKER_QUEUE_TYPES {
   ANCHOR_BUILD_COMMAND = 'ANCHOR_BUILD_COMMAND',
   ANCHOR_DEPLOY_COMMAND = 'ANCHOR_DEPLOY_COMMAND',
   ANCHOR_TEST_COMMAND = 'ANCHOR_TEST_COMMAND',
}

export enum COMMAND {
   WINTERFELL_BUILD = 'WINTERFELL_BUILD',
   WINTERFELL_TEST = 'WINTERFELL_TEST',
   WINTERFELL_DEPLOY_DEVNET = 'WINTERFELL_DEPLOY_DEVNET',
   WINTERFELL_DEPLOY_MAINNET = 'WINTERFELL_DEPLOY_MAINNET',
}

export enum JOB_STATUS {
   QUEUED = 'QUEUED',
   POD_CREATING = 'POD_CREATING',
   POD_RUNNING = 'POD_RUNNING',
   COMMAND_EXECUTING = 'COMMAND_EXECUTING',
   POD_TERMINATING = 'POD_TERMINATING',
   COMPLETED = 'COMPLETED',
   FAILED = 'FAILED',
}

export interface CommandResult {
   stdout: string;
   stderr: string;
}

export interface BuildResult extends CommandResult {
   success: boolean;
   output: string;
}

export interface DeployResult extends CommandResult {
   success: boolean;
   output: string;
}

export interface TestResult extends CommandResult {
   success: boolean;
   output: string;
}

export interface BuildJobPayload {
   userId: string;
   contractId: string;
   projectName: string;
}

export interface CommandResult {
   success: boolean;
   stdout: string;
   stderr: string;
}
