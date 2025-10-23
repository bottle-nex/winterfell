import { k8s_config } from '../services/init_services';
import { logger } from './logger';

export async function waitForPodRunning(pod_name: string, namespace: string, timeout: number = 60) {
   const start_time = Date.now();

   while (Date.now() - start_time < timeout * 1000) {
      try {
         const response = await k8s_config.core_api.readNamespacedPodStatus({
            name: pod_name,
            namespace,
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

   logger.warn('Pod startup timeout exceeded', { podName: pod_name, timeout });
}
