import { V1Pod } from '@kubernetes/client-node';
import { env } from '../configs/env.config';
import { k8s_config } from '../configs/kubernetes.config';
import { CreatePodRequest } from '../types/k8_types';
import PodTemplate from '../utils/pod-templates';
import { logger } from '../utils/logger';
import { waitForPodRunning } from '../utils/pod_waiter';
import { mapPodStatus } from '../utils/map_pod_status';
import { FileContent } from '../types/file_type';

export default class PodService {
   public namespace: string = env.KUBERNETES_NAMESPACE;
   private container_name: string = '';

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
         await waitForPodRunning(podName, this.namespace, 60);
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

   public async get_pod_status(userId: string, sessionId: string) {
      try {
         const pod_name = PodTemplate.get_pod_name(userId, sessionId);
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
            sessionId,
         };

         logger.info('Retrieved pod status', pod_data);
         return pod_data;
      } catch (error) {
         const err = error as { code?: number; error: string };

         if (err?.code === 404) {
            logger.warn('Pod not found', { userId, sessionId, namespace: this.namespace });
            return {
               podName: PodTemplate.get_pod_name(userId, sessionId),
               podStatus: 'unknown',
               podIp: null,
               userId,
               sessionId,
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
      try {
         const total_files = files.length;
         logger.info(`Copying ${total_files} files to pod ${pod_name}`);

         let copied = 0;

         for (const file of files) {
            const full_path = `/workspace/${projectName}/${file.path}`;
            const dir = full_path.substring(0, full_path.lastIndexOf('/'));

            if (dir !== `/workspace/${projectName}`) {
               await this.execute_command(pod_name, ['mkdir', '-p', dir]);
            }
            const base_64_content = Buffer.from(file.content).toString('base64');
            await this.execute_command(pod_name, [
               'sh',
               '-c',
               `echo '${base_64_content}' | base64 -d > ${full_path}`,
            ]);
            copied++;
            logger.debug(`[${copied}/${total_files}] Copied ${file.path}`);
         }

         logger.info(`all ${total_files} files copied to ${pod_name}`);
         const verifyResult = await this.execute_command(pod_name, [
            'sh',
            '-c',
            `find /workspace/${projectName} -type f | wc -l`,
         ]);

         logger.debug('Files created count', { count: verifyResult.stdout.trim() });
      } catch (err) {
         logger.error('Failed to copy files to pod', { err, pod_name });
      }
   }
}
