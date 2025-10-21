export enum WORKER_QUEUE_TYPES {
   ANCHOR_BUILD_COMMAND = 'ANCHOR_BUILD_COMMAND',
   ANCHOR_DEPLOY_COMMAND = 'ANCHOR_DEPLOY_COMMAND',
   ANCHOR_TEST_COMMAND = 'ANCHOR_TEST_COMMAND',
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
