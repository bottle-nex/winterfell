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
         const pod_template: V1Pod = PodTemplate.get_anchor_pod_template(
            req.userId,
            req.sessionId,
            req.projectName,
         );

         logger.info('Creating pod', {
            userId: req.userId,
            sessionId: req.sessionId,
            projectName: req.projectName,
            namespace: this.namespace,
         });

         const response = await k8s_config.core_api.createNamespacedPod({
            namespace: this.namespace,
            body: pod_template,
         });

         const podName = response.metadata?.name as string;

         await this.wait_for_pod_running(podName, 60);
         
         return podName;

      } catch (err) {
         logger.error('Failed to create pod', {
            error: err instanceof Error ? err.message : String(err),
            userId: req.userId,
            sessionId: req.sessionId,
         });
         throw err;
      }
   }

   public async delete_pod(userId: string, sessionId: string) {
      try {
         const pod_name = PodTemplate.get_pod_name(userId, sessionId);

         logger.info('Deleting pod', {
            podName: pod_name,
            userId,
            sessionId,
            namespace: this.namespace,
         });

         await k8s_config.core_api.deleteNamespacedPod({
            name: pod_name,
            namespace: this.namespace,
         });

         logger.debug('Pod deleted successfully', {
            podName: pod_name,
            userId,
            sessionId,
         });
      } catch (error) {
         logger.error('Failed to delete pod', {
            error: error instanceof Error ? error.message : String(error),
            userId,
            sessionId,
            podName: PodTemplate.get_pod_name(userId, sessionId),
         });
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
                  logger.debug('Pod is running', { podName: pod_name });
                  return;
               case 'Failed':
                  logger.error('Pod failed', { podName: pod_name, phase });
                  return;
               case 'Unknown':
                  logger.warn('Pod is in unknown state', { podName: pod_name });
                  return;
               default:
                  logger.debug('Pod state change', { podName: pod_name, phase });
            }

            await new Promise((res) => setTimeout(res, 2000));
         } catch (err) {
            logger.error('Error waiting for pod to run', {
               error: err instanceof Error ? err.message : String(err),
               podName: pod_name,
            });
         }
      }

      logger.warn('Pod startup timeout exceeded', {
         podName: pod_name,
         timeout,
      });
   }

   public async get_pod_status(userId: string, sessionId: string) {
      try {
         const pod_name = PodTemplate.get_pod_name(userId, sessionId);
         const response = await k8s_config.core_api.readNamespacedPod({
            name: pod_name,
            namespace: this.namespace,
         });

         const is_terminating = response.metadata?.deletionTimestamp !== undefined;
         const phase = is_terminating ? 'Terminating' : response.status?.phase;
         const status = this.map_pod_status(phase);

         const pod_data = {
            podName: response.metadata?.name,
            podStatus: status,
            podIp: response.status?.podIP,
            userId: userId,
            sessionId: sessionId,
         };

         logger.info('Retrieved pod status', pod_data);
         return pod_data;
      } catch (error) {
         const err = error as { code?: number; error: string };

         if (err?.code === 404) {
            logger.warn('Pod not found', {
               userId,
               sessionId,
               namespace: this.namespace,
            });

            return {
               podName: PodTemplate.get_pod_name(userId, sessionId),
               podStatus: 'unknown',
               podIp: null,
               userId: userId,
               sessionId: sessionId,
               error: 'Pod not found',
            };
         }

         logger.error('Failed to retrieve pod status', {
            error: err instanceof Error ? err.message : String(err),
            podName: PodTemplate.get_pod_name(userId, sessionId),
            userId,
            sessionId,
         });
      }
   }

   private map_pod_status(
      phase: string | undefined,
   ): 'pending' | 'running' | 'succeeded' | 'failed' | 'terminating' | 'unknown' {
      switch (phase) {
         case 'Pending':
            return 'pending';
         case 'Running':
            return 'running';
         case 'Succeeded':
            return 'succeeded';
         case 'Failed':
            return 'failed';
         case 'Terminating':
            return 'terminating';
         default:
            return 'unknown';
      }
   }
}
