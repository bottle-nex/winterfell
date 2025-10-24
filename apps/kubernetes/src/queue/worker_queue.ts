import Bull, { Job } from 'bull';
import { WORKER_QUEUE_TYPES } from '../types/worker_queue_types';
import { pod_service } from '../services/init_services';
import { logger } from '../utils/logger';
import { get_files } from '../services/client_services';
import { FileContent } from '../types/file_type';

export default class ServerToOrchestratorQueue {
   private client: Bull.Queue;

   constructor(queue_name: string) {
      this.client = new Bull(queue_name, { redis: 'redis://localhost:6379' });
      this.setup_queue_processors();
   }

   private setup_queue_processors() {
      this.client.process(
         WORKER_QUEUE_TYPES.ANCHOR_BUILD_COMMAND,
         this.run_command_on_pod.bind(this, ['anchor', 'build']),
      );

      this.client.process(
         WORKER_QUEUE_TYPES.ANCHOR_TEST_COMMAND,
         this.run_command_on_pod.bind(this, ['anchor', 'test']),
      );

      this.client.process(
         WORKER_QUEUE_TYPES.ANCHOR_DEPLOY_COMMAND,
         this.run_command_on_pod.bind(this, ['anchor', 'deploy']),
      );
      logger.info('server-orchestrator queue started');
   }

   private async run_command_on_pod(
      command: string[],
      job: Job,
   ): Promise<{ success: boolean; stdout: string; stderr: string }> {
      const { userId, contractId, projectName } = job.data;
      const codebase: FileContent[] = await get_files(contractId);

      try {
         const pod_name = await pod_service.create_pod({ userId, contractId, projectName });
         await pod_service.copy_files_to_pod(pod_name, projectName, codebase);
         console.log('files copied');
         pod_service.stream_logs(pod_name, (chunk) => logger.info(`[${pod_name}] ${chunk}`));
         const result = await pod_service.execute_command(pod_name, command);

         return {
            success: true,
            stdout: result.stdout,
            stderr: result.stderr,
         };
      } catch (error) {
         logger.error(`Command ${command.join(' ')} failed`, error);
         await pod_service.delete_pod(userId, contractId);
         throw error;
      } finally {
         await pod_service.delete_pod(userId, contractId);
      }
   }

   public async disconnect(): Promise<void> {
      await this.client.close();
   }
}
