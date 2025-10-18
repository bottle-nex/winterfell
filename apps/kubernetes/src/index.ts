<<<<<<< HEAD
import * as k8s from '@kubernetes/client-node';
import { SmsCommandContextImpl } from 'twilio/lib/rest/supersim/v1/smsCommand';
=======
import express from 'express';
import PodService from './services/pod.services';
import createPodController from './controllers/create_pod_controller';
import getPodStatusController from './controllers/get_pod_status_controller';
import deletePodController from './controllers/delete_pod_controller';
import { env } from './configs/env.config';
import { logger } from './utils/logger';
>>>>>>> v2

const app = express();
app.use(express.json());
const PORT = env.KUBERNETES_PORT;
export const podService = new PodService();

// pod-controllers
app.post('/create-pod', createPodController);
app.get('/get-pod-status', getPodStatusController);
app.delete('/delete-pod', deletePodController);

<<<<<<< HEAD
async function listPods() {
   const res = await k8sApi.listNamespacedPod({
      namespace: 'default',
   });

   console.log(res.items.map((p) => p.metadata?.name));
}

listPods();
=======
app.listen(PORT, () => {
   logger.info(`Orchestrator running on port ${PORT}`);
});
>>>>>>> v2
