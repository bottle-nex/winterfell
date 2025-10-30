import { k8s_config } from '../services/init_services';

export async function waitForPodRunning(
   pod_name: string,
   namespace: string,
   timeout: number = 60,
): Promise<void> {
   const start_time = Date.now();
   const timeout_ms = timeout * 1000;

   while (Date.now() - start_time < timeout_ms) {
      try {
         const response = await k8s_config.core_api.readNamespacedPodStatus({
            name: pod_name,
            namespace,
         });
         const phase = response.status?.phase;

         switch (phase) {
            case 'Running':
               return;

            case 'Failed':
               throw new Error(`Pod ${pod_name} failed to start`);

            case 'Unknown':
               throw new Error(`Pod ${pod_name} is in unknown state`);

            case 'Pending':
               break;

            default:
               break;
         }

         await new Promise((res) => setTimeout(res, 2000));
      } catch (err: any) {
         if (err.code === 404 || err.statusCode === 404) {
            await new Promise((res) => setTimeout(res, 2000));
            continue;
         }
         console.error('pod not found', err);
      }
   }
   throw new Error(`Pod ${pod_name} did not reach Running state within ${timeout} seconds`);
}
