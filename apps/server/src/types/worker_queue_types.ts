export enum WORKER_QUEUE_TYPES {
    ANCHOR_BUILD_COMMAND = 'ANCHOR_BUILD_COMMAND',
    ANCHOR_DEPLOY_COMMAND = 'ANCHOR_DEPLOY_COMMAND',
    ANCHOR_TEST_COMMAND = 'ANCHOR_TEST_COMMAND',
}

export interface AnchorBuildQueueData {
    userId: string;
    contractId: string;
    projectName: string;
}
