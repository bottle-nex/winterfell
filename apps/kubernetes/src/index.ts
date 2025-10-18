import express from 'express';
import PodService from './services/pod.services';
import createPodController from './controllers/create_pod_controller';
import getPodStatusController from './controllers/get_pod_status_controller';
import deletePodController from './controllers/delete_pod_controller';
import { env } from './configs/env.config';
import { logger } from './utils/logger';
import { writeFileTree } from './parser/file_node_to_file_parser';
import { fileTree } from './test/test';
import * as path from 'path';

const app = express();
app.use(express.json());
const PORT = env.KUBERNETES_PORT;
export const podService = new PodService();

// pod-controllers
app.post('/create-pod', createPodController);
app.get('/get-pod-status', getPodStatusController);
app.delete('/delete-pod', deletePodController);

writeFileTree(fileTree, path.join(process.cwd(), 'test-project'));

app.listen(PORT, () => {
   logger.info(`Orchestrator running on port ${PORT}`);
});
