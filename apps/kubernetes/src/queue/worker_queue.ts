import Bull, { Job } from 'bull';
import { WORKER_QUEUE_TYPES } from '../types/worker_queue_types';
import { pod_service, publisher } from '../services/init_services';
import { logger } from '../utils/logger';
import { get_files } from '../services/client_services';
import { FileContent } from '../types/file_type';
import { env } from '../configs/env.config';

export default class ServerToOrchestratorQueue {
   private client: Bull.Queue;

   constructor(queue_name: string) {
      this.client = new Bull(queue_name, {
         redis: env.KUBERNETES_REDIS_URL,
         defaultJobOptions: {
            attempts: 1,
            removeOnComplete: true,
            removeOnFail: true,
         },
      });
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
      console.log("data came from the queue");
      try {
         await publisher.publish_status(userId, contractId, 'started');

         const codebase: FileContent[] = (await get_files(contractId)).filter(
            (file) => !file.path.includes('Cargo.lock'),
         );

         let pod_name: string | null = await pod_service.get_pod_if_running(userId, contractId);

         if (pod_name === null) {
            pod_name = await pod_service.create_pod({ userId, contractId, projectName });
         }

         await pod_service.copy_files_to_pod(pod_name, projectName, codebase);
         logger.info('Files copied to pod', { pod_name });

         const fullCommand = [
            'bash',
            '-l',
            '-c',
            `cd /workspace/${projectName} && rm -f Cargo.lock && ${command.join(' ')} 2>&1`,
         ];

         const result = await pod_service.execute_command(
            pod_name,
            fullCommand,
            async (chunk: string) => {
               console.warn(chunk);
               const lines = chunk.split('\n').filter((line) => line.trim());
               for (const line of lines) {
                  await publisher.publish_build_log(userId, contractId, line + '\n');
               }
            },
         );

         logger.info('Command completed successfully', {
            command: command.join(' '),
            stdoutLength: result.stdout.length,
            stderrLength: result.stderr.length,
         });

         await publisher.publish_status(userId, contractId, 'completed');

         return {
            success: true,
            stdout: result.stdout,
            stderr: result.stderr,
         };
      } catch (error) {
         logger.error('Command execution failed', {
            command: command.join(' '),
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            userId,
            contractId,
         });

         const errorMessage = error instanceof Error ? error.message : String(error);
         await publisher.publish_build_log(userId, contractId, `Error: ${errorMessage}\n`);
         await publisher.publish_status(userId, contractId, 'failed');

         return {
            success: false,
            stdout: '',
            stderr: errorMessage,
         };
      }
   }

   public async disconnect(): Promise<void> {
      await publisher.disconnect();
      await this.client.close();
   }
}
