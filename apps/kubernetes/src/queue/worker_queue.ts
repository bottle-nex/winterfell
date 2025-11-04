import { Job, JobScheduler, Queue, Worker } from 'bullmq';
import { BuildJobPayload, CommandResult, JOB_STATUS, WORKER_QUEUE_TYPES } from '../types/worker_queue_types';
import { job_tracker, pod_service, publisher } from '../services/init_services';
import { logger } from '../utils/logger';
import { get_files } from '../services/client_services';
import { FileContent } from '../types/file_type';
import queue_config from '../configs/queue.config';

export default class ServerToOrchestratorQueue {
   private client: Queue;
   private worker: Worker;

   constructor(queue_name: string) {
      this.client = new Queue(queue_name, queue_config);
      this.worker = new Worker(
         queue_name,
         this.process_job.bind(this),
         queue_config
      );
      
      this.setup_event_handlers();
      logger.info('kubernetes server orchestrator queue started');
   }

   private setup_event_handlers() {
      this.worker.on('completed', (job) => {
         logger.info('Job completed', {
            jobId: job.id,
            jobName: job.name,
         });
      });

      this.worker.on('failed', (job, err) => {
         logger.error('Job failed', {
            jobId: job?.id,
            jobName: job?.name,
            error: err.message,
         });
      });

      this.worker.on('error', (err) => {
         logger.error('Worker error', { error: err.message });
      });
   }

   private async process_job(job: Job<BuildJobPayload>): Promise<CommandResult> {
      const command_map: Record<WORKER_QUEUE_TYPES, string[]> = {
         [WORKER_QUEUE_TYPES.ANCHOR_BUILD_COMMAND]: ['anchor', 'build'],
         [WORKER_QUEUE_TYPES.ANCHOR_TEST_COMMAND]: ['anchor', 'test'],
         [WORKER_QUEUE_TYPES.ANCHOR_DEPLOY_COMMAND]: ['anchor', 'deploy'],
      };

      const command = command_map[job.name as WORKER_QUEUE_TYPES];
      
      if (!command) {
         throw new Error(`unknown command ${job.name}`);
      }

      return this.run_command_on_pod(command, job);
   }

   private async run_command_on_pod(
      command: string[],
      job: Job<BuildJobPayload>,
   ): Promise<CommandResult> {
      const { userId, contractId, projectName } = job.data;
      
      logger.info('Processing job from queue', {
         jobId: job.id,
         command: command.join(' '),
         userId,
         contractId,
      });

      let pod_name: string | null = null;

      try {
         await job_tracker.acquire_lock(contractId);
         await publisher.publish_status(userId, contractId, JOB_STATUS.QUEUED);

         const codebase: FileContent[] = (await get_files(contractId)).filter(
            (file) => !file.path.includes('Cargo.lock'),
         );

         // let pod_name: string | null = await pod_service.get_pod_if_running(userId, contractId);
         
         // if (pod_name === null) {
         //    pod_name = await pod_service.create_pod({ userId, contractId, projectName });
         // }

         await job_tracker.update_status(contractId, JOB_STATUS.POD_CREATING);
         await publisher.publish_status(userId, contractId, JOB_STATUS.POD_CREATING);

         pod_name = await pod_service.create_pod({ userId, contractId, projectName });

         await job_tracker.update_status(contractId, JOB_STATUS.POD_RUNNING);
         await publisher.publish_status(userId, contractId, JOB_STATUS.POD_RUNNING);

         await pod_service.copy_files_to_pod(pod_name, projectName, codebase);
         logger.info('Files copied to pod', { pod_name });

         await job_tracker.update_status(contractId, JOB_STATUS.COMMAND_EXECUTING);
         await publisher.publish_status(userId, contractId, JOB_STATUS.COMMAND_EXECUTING);

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
               const lines = chunk.split('\n').filter((line) => line.trim());
               for (const line of lines) {
                  await publisher.publish_build_log(userId, contractId, line + '\n');
               }
            },
         );

         logger.info('Command completed successfully', {
            jobId: job.id,
            command: command.join(' '),
            stdoutLength: result.stdout.length,
            stderrLength: result.stderr.length,
         });

         await job_tracker.update_status(contractId, JOB_STATUS.COMPLETED);
         await publisher.publish_status(userId, contractId, JOB_STATUS.COMPLETED);

         return {
            success: true,
            stdout: result.stdout,
            stderr: result.stderr,
         };
      } catch (error) {
         logger.error('Command execution failed', {
            jobId: job.id,
            command: command.join(' '),
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            userId,
            contractId,
         });

         const errorMessage = error instanceof Error ? error.message : String(error);
         await publisher.publish_build_log(userId, contractId, `Error: ${errorMessage}\n`);
         await publisher.publish_status(userId, contractId, JOB_STATUS.FAILED);
         await job_tracker.update_status(contractId, JOB_STATUS.FAILED);

         throw error;
      } finally {
         if (pod_name) {
            try {
               await job_tracker.update_status(contractId, JOB_STATUS.POD_TERMINATING);
               await publisher.publish_status(userId, contractId, JOB_STATUS.POD_TERMINATING);

               await pod_service.delete_pod(userId, contractId);
               logger.info(`Pod delted successfully`, { pod_name, contractId });
            } catch (error) {
               logger.error('Failed to delete pod in finally block', {
                  pod_name,
                  error: error instanceof Error ? error.message : String(error),
               });
            }
         }

         await job_tracker.release_lock(contractId);
      }
   }

   public async disconnect(): Promise<void> {
      await publisher.disconnect();
      await this.worker.close();
      await this.client.close();
   }
}