import express from 'express';
import PodService from './services/pod.services';
import createPodController from './controllers/create_pod_controller';
import getPodStatusController from './controllers/get_pod_status_controller';
import deletePodController from './controllers/delete_pod_controller';
import { env } from './configs/env.config';
import { logger } from './utils/logger';
import { k8s_config } from './configs/kubernetes.config';
const app = express();
app.use(express.json());
const PORT = env.KUBERNETES_PORT;
export const podService = new PodService();

k8s_config.

// pod-controllers
app.post('/create-pod', createPodController);
app.get('/get-pod-status', getPodStatusController);
app.delete('/delete-pod', deletePodController);

app.listen(PORT, () => {
   logger.info(`Orchestrator running on port ${PORT}`);
});
