import { Redis } from 'ioredis';
import { logger } from '../utils/logger';
import PodTemplate from '../utils/pod-templates';
import { env } from '../configs/env.config';
import { JOB_STATUS } from '../types/worker_queue_types';

export interface TerminalStreamMessage {
   type: 'TERMINAL_STREAM';
   payload: string;
}

export interface StatusUpdateMessage {
   type: 'STATUS_UPDATE',
   payload: {
      status: JOB_STATUS,
   }
}

export type ParsedMessage = TerminalStreamMessage | StatusUpdateMessage;

export default class RedisPublisher {
   private redis: Redis;

   constructor() {
      this.redis = new Redis(env.KUBERNETES_REDIS_URL);
      logger.info('Redis publisher initialized');
   }

   private async publish(channel: string, message: any): Promise<void> {
      try {
         const messageStr = JSON.stringify(message);
         await this.redis.publish(channel, messageStr);
      } catch (error) {
         logger.error('Error publishing message', { channel, error });
         throw error;
      }
   }

   public async disconnect(): Promise<void> {
      await this.redis.quit();
      logger.info('Redis publisher disconnected');
   }

   public async publish_build_log(userId: string, contractId: string, log: string): Promise<void> {
      const channel = PodTemplate.get_pod_name(userId, contractId);

      const data: TerminalStreamMessage = {
         type: 'TERMINAL_STREAM',
         payload: log,
      };

      await this.publish(channel, data);
   }

   public async publish_status(
      userId: string,
      contractId: string,
      status: JOB_STATUS,
   ): Promise<void> {
      const channel = PodTemplate.get_pod_name(userId, contractId);
      const data: StatusUpdateMessage = {
         type: 'STATUS_UPDATE',
         payload: {
            status,
         },
      };
      await this.publish(channel, data);
   }
}
