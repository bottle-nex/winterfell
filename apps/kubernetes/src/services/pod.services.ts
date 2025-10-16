import { V1Pod } from '@kubernetes/client-node';
import { env } from '../configs/env.config';
import { k8s_config } from '../configs/kubernetes.config';
import { CreatePodRequest, PodInfo } from '../types/k8_types';
import PodTemplate from '../utils/pod-templates';
import { logger } from '../utils/logger';

export default class PodService {
   private namespace: string = env.KUBERNETES_NAMESPACE;

   public async create_pod(req: CreatePodRequest) {
      try {
         const pod_template: V1Pod = PodTemplate.getAnchorPodTemplate(
            req.userId,
            req.sessionId,
            req.projectName,
         );

         logger.info(`creating pod for user ${req.userId} in namespace ${this.namespace}`);
         const response = await k8s_config.core_api.createNamespacedPod({
            namespace: this.namespace,
            body: pod_template,
         });

         const pod_info: PodInfo = {
            podName: response.metadata?.name as string,
            userId: req.userId,
            sessionId: req.sessionId,
            status: 'pending',
            createdAt: new Date(),
            namespace: this.namespace,
         };
         await this.wait_for_pod_running(pod_info.podName, 60);
      } catch (err) {
         logger.error('error creating pod : ', err);
         throw err;
      }
   }

   public async wait_for_pod_running(pod_name: string, timeout: number = 60) {
      const start_time = Date.now();
      while (Date.now() - start_time < timeout * 1000) {
         try {
            const response = await k8s_config.core_api.readNamespacedPodStatus({
               name: pod_name,
               namespace: this.namespace,
            });
            const phase = response.status?.phase;

            switch (phase) {
               case 'Running':
                  logger.info(`Pod ${pod_name} is running`);
                  return;
               case 'Failed':
                  logger.error(`Pod ${pod_name} failed`);
                  return;
               case 'Unknown':
                  logger.error(`Pod ${pod_name} is in unknown state`);
                  return;
               default:
                  logger.info(`Pod ${pod_name} is in ${phase} state`);
            }
            await new Promise((res) => setTimeout(res, 2000));
         } catch (err) {
            logger.error('error waiting for pod to run:', err);
         }
      }
   }
}
