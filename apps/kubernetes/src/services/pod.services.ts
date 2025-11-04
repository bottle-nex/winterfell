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

   public async create_pod(req: CreatePodRequest): Promise<string> {
      logger.info('Creating pod', {
         userId: req.userId,
         contractId: req.contractId,
         projectName: req.projectName,
         namespace: this.namespace,
      });

      try {
         const pod_template: V1Pod = PodTemplate.get_anchor_pod_template(
            req.userId,
            req.contractId,
            req.projectName,
         );

         const response = await k8s_config.core_api.createNamespacedPod({
            namespace: this.namespace,
            body: pod_template,
         });

         const podName = response.metadata?.name;

         if (!podName) {
            throw new Error('Pod created but no name returned');
         }

         logger.info('Pod created, waiting for Running state', { podName });

         await waitForPodRunning(podName, this.namespace, 60);
         await this.waitForContainerReady(podName);

         logger.info('Pod is ready', { podName });

         return podName;
      } catch (err) {
         logger.error('Failed to create pod', {
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
            userId: req.userId,
            contractId: req.contractId,
         });
         throw err; // Re-throw instead of swallowing the error
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

         logger.info('Pod deleted successfully', {
            podName: pod_name,
            userId,
            contractId,
         });
      } catch (err) {
         logger.error('Failed to delete pod', {
            error: err instanceof Error ? err.message : String(err),
            userId,
            contractId,
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
      onData?: (chunk: string) => void,
   ): Promise<{ stdout: string; stderr: string }> {
      return k8s_config.exec_command_in_pod({
         namespace: this.namespace,
         pod_name,
         container_name: this.container_name,
         command,
         onData,
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

         // Ensure base directory exists FIRST
         await this.execute_command(pod_name, ['mkdir', '-p', base_dir]);

         // DELETE source files but PRESERVE target/ directory for faster rebuilds
         try {
            await this.execute_command(pod_name, [
               'bash',
               '-c',
               `cd ${base_dir} && find . -maxdepth 1 -mindepth 1 ! -name 'target' -exec rm -rf {} + 2>/dev/null || true && \
             rm -rf programs migrations tests 2>/dev/null || true`,
            ]);
            logger.info('Cleaned project directory (preserved target/)', { pod_name, base_dir });
         } catch (err) {
            console.error('Error cleaning project directory: ', err);
         }

         // Copy all files
         for (const file of files) {
            const full_path = `${base_dir}/${file.path}`;
            const dir = full_path.substring(0, full_path.lastIndexOf('/'));

            if (dir !== base_dir) {
               await this.execute_command(pod_name, ['mkdir', '-p', dir]);
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

            logger.debug('Container not ready, retrying...', {
               pod_name,
               attempt: retries,
               maxRetries,
            });

            await new Promise((resolve) => setTimeout(resolve, delay));
            delay = Math.min(delay * 1.5, 8000);
         }
      }
   }

   // public async get_pod_if_running(userId: string, contractId: string): Promise<string | null> {
   //    const pod_name = PodTemplate.get_pod_name(userId, contractId);

   //    try {
   //       const pod = await k8s_config.core_api.readNamespacedPod({
   //          name: pod_name,
   //          namespace: this.namespace,
   //       });

   //       if (pod.status?.phase === 'Running') {
   //          logger.info('Found existing running pod', { pod_name });
   //          return pod_name;
   //       }

   //       logger.info('Pod exists but not running, deleting', {
   //          pod_name,
   //          phase: pod.status?.phase,
   //       });

   //       // Pod exists but not running, delete it
   //       await k8s_config.core_api.deleteNamespacedPod({
   //          name: pod_name,
   //          namespace: this.namespace,
   //       });

   //       return null;
   //    } catch (error: any) {
   //       if (error.code === 404 || error.statusCode === 404) {
   //          logger.debug('Pod does not exist', { pod_name });
   //          return null;
   //       }
   //       logger.error('Error checking pod status', {
   //          error: error instanceof Error ? error.message : String(error),
   //          pod_name,
   //       });
   //       throw error;
   //    }
   // }
}
