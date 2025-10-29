import { V1Pod } from '@kubernetes/client-node';
import { env } from '../configs/env.config';
import { CreatePodRequest } from '../types/k8_types';
import PodTemplate from '../utils/pod-templates';
import { logger } from '../utils/logger';
import { waitForPodRunning } from '../utils/pod_waiter';
import { mapPodStatus } from '../utils/map_pod_status';
import { FileContent } from '../types/file_type';
import { k8s_config } from './init_services';

export default class PodService {
   public namespace: string = env.KUBERNETES_NAMESPACE;
   private container_name: string = 'anchor-dev';

   public async create_pod(req: CreatePodRequest) {
      try {
         const pod_template: V1Pod = PodTemplate.get_anchor_pod_template(
            req.userId,
            req.contractId,
            req.projectName,
         );

         logger.info('Creating pod', {
            userId: req.userId,
            contractId: req.contractId,
            projectName: req.projectName,
            namespace: this.namespace,
         });

         const response = await k8s_config.core_api.createNamespacedPod({
            namespace: this.namespace,
            body: pod_template,
         });

         const podName = response.metadata?.name as string;
         await waitForPodRunning(podName, this.namespace, 60);
         await this.waitForContainerReady(podName);

         return podName;
      } catch (err) {
         logger.error('Failed to create pod', {
            error: err instanceof Error ? err.message : String(err),
            userId: req.userId,
            contractId: req.contractId,
         });
         throw err;
      }
   }

   public async delete_pod(userId: string, contractId: string) {
      try {
         const pod_name = PodTemplate.get_pod_name(userId, contractId);

         logger.info('Deleting pod', {
            podName: pod_name,
            userId,
            contractId,
            namespace: this.namespace,
         });

         await k8s_config.core_api.deleteNamespacedPod({
            name: pod_name,
            namespace: this.namespace,
         });

         logger.debug('Pod deleted successfully', {
            podName: pod_name,
            userId,
            contractId,
         });
      } catch (error) {
         logger.error('Failed to delete pod', {
            error: error instanceof Error ? error.message : String(error),
            userId,
            contractId,
            podName: PodTemplate.get_pod_name(userId, contractId),
         });
      }
   }

   public async get_pod_status(userId: string, contractId: string) {
      try {
         const pod_name = PodTemplate.get_pod_name(userId, contractId);
         const response = await k8s_config.core_api.readNamespacedPod({
            name: pod_name,
            namespace: this.namespace,
         });

         const is_terminating = response.metadata?.deletionTimestamp !== undefined;
         const phase = is_terminating ? 'Terminating' : response.status?.phase;
         const status = mapPodStatus(phase);

         const pod_data = {
            podName: response.metadata?.name,
            podStatus: status,
            podIp: response.status?.podIP,
            userId,
            contractId,
         };

         logger.info('Retrieved pod status', pod_data);
         return pod_data;
      } catch (error) {
         const err = error as { code?: number; error: string };

         if (err?.code === 404) {
            logger.warn('Pod not found', { userId, contractId, namespace: this.namespace });
            return {
               podName: PodTemplate.get_pod_name(userId, contractId),
               podStatus: 'unknown',
               podIp: null,
               userId,
               contractId,
               error: 'Pod not found',
            };
         }

         logger.error('Failed to retrieve pod status', {
            error: err instanceof Error ? err.message : String(err),
            podName: PodTemplate.get_pod_name(userId, contractId),
            userId,
            contractId,
         });
      }
   }

   public async execute_command(
      pod_name: string,
      command: string[],
   ): Promise<{ stdout: string; stderr: string }> {
      return k8s_config.exec_command_in_pod({
         namespace: this.namespace,
         pod_name,
         container_name: this.container_name,
         command,
      });
   }

   public async stream_logs(pod_name: string, onData: (chunk: string) => void) {
      return k8s_config.stream_pod_logs({
         namespace: this.namespace,
         pod_name,
         container_name: this.container_name,
         onData,
      });
   }

   public async copy_files_to_pod(
      pod_name: string,
      projectName: string,
      files: FileContent[],
   ): Promise<void> {
      const total_files = files.length;

      if (!files || files.length === 0) {
         logger.warn('No files to copy', { pod_name, projectName });
         return;
      }

      try {
         const base_dir = `/workspace/${projectName}`;
         await this.execute_command(pod_name, ['mkdir', '-p', base_dir]);

         for (const file of files) {
            const full_path = `${base_dir}/${file.path}`;
            const dir = full_path.substring(0, full_path.lastIndexOf('/'));

            if (dir !== base_dir) {
               await this.execute_command(pod_name, ['mkdir', '-p', dir]);
               logger.debug('dir created : ', dir);
            }

            const base_64_content = Buffer.from(file.content).toString('base64');

            await this.execute_command(pod_name, [
               'sh',
               '-c',
               `echo '${base_64_content}' | base64 -d > ${full_path}`,
            ]);
         }
         logger.info(`Successfully copied all ${total_files} files to ${pod_name}`);
      } catch (err) {
         logger.error('Failed to copy files to pod', {
            error: err instanceof Error ? err.message : String(err),
            pod_name,
            projectName,
         });
         throw err;
      }
   }

   private async waitForContainerReady(
      pod_name: string,
      maxRetries: number = 15,
      initialDelayMs: number = 5000,
   ): Promise<void> {
      let retries = 0;
      let delay = initialDelayMs;

      while (retries < maxRetries) {
         try {
            await this.execute_command(pod_name, ['echo', 'ready']);
            logger.info('Container ready to accept commands', { pod_name });
            return;
         } catch (error) {
            retries++;
            const errorMsg = error instanceof Error ? error.message : String(error);

            if (retries >= maxRetries) {
               throw new Error(`Container not ready after ${maxRetries} attempts: ${errorMsg}`);
            }

            await new Promise((resolve) => setTimeout(resolve, delay));
            delay = Math.min(delay * 1.5, 8000);
         }
      }
   }
}
