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

      // Check if files exist
      if (!files || files.length === 0) {
         logger.warn('No files to copy', { pod_name, projectName });
         return;
      }

      logger.info(`Starting to copy ${total_files} files to pod ${pod_name}`);

      try {
         // Add a small delay to ensure container is ready for exec commands
         await new Promise((resolve) => setTimeout(resolve, 2000));

         // Verify pod is ready to accept commands
         try {
            await this.execute_command(pod_name, ['echo', 'ready']);
            logger.debug('Pod ready to accept commands');
         } catch (readyErr) {
            logger.error('Pod not ready for commands', {
               err: readyErr instanceof Error ? readyErr.message : String(readyErr),
               pod_name,
            });
            throw new Error('Pod not ready to accept exec commands');
         }

         let copied = 0;

         for (const file of files) {
            const full_path = `/workspace/${projectName}/${file.path}`;
            const dir = full_path.substring(0, full_path.lastIndexOf('/'));

            // Create directory structure
            if (dir !== `/workspace/${projectName}`) {
               try {
                  await this.execute_command(pod_name, ['mkdir', '-p', dir]);
                  logger.debug(`Created directory: ${dir}`);
               } catch (mkdirErr) {
                  logger.error('Failed to create directory', {
                     dir,
                     error: mkdirErr instanceof Error ? mkdirErr.message : String(mkdirErr),
                  });
                  throw mkdirErr;
               }
            }

            // Copy file content
            try {
               const base_64_content = Buffer.from(file.content).toString('base64');

               // Check if base64 content is too large for single command
               if (base_64_content.length > 100000) {
                  logger.warn('Large file detected', {
                     path: file.path,
                     size: base_64_content.length,
                  });
               }

               await this.execute_command(pod_name, [
                  'sh',
                  '-c',
                  `echo '${base_64_content}' | base64 -d > ${full_path}`,
               ]);

               copied++;
               logger.debug(`[${copied}/${total_files}] Copied ${file.path}`);
            } catch (copyErr) {
               logger.error('Failed to copy file', {
                  path: file.path,
                  error: copyErr instanceof Error ? copyErr.message : String(copyErr),
               });
               throw copyErr;
            }
         }

         logger.info(`Successfully copied all ${total_files} files to ${pod_name}`);

         // Verify files were created
         const verifyResult = await this.execute_command(pod_name, [
            'sh',
            '-c',
            `find /workspace/${projectName} -type f | wc -l`,
         ]);

         const fileCount = parseInt(verifyResult.stdout.trim());
         logger.info('File verification', {
            expected: total_files,
            actual: fileCount,
            match: fileCount === total_files,
         });

         if (fileCount !== total_files) {
            throw new Error(`File count mismatch: expected ${total_files}, got ${fileCount}`);
         }
      } catch (err) {
         logger.error('Failed to copy files to pod', {
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
            pod_name,
            projectName,
            fileCount: files.length,
         });
         throw err; // ✅ RE-THROW the error!
      }
   }
}
