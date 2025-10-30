import { Redis } from 'ioredis';
import { logger } from '../utils/logger';
import PodTemplate from '../utils/pod-templates';

export interface ParsedMessage {
   type: 'TERMINAL_STREAM';
   payload: string;
}

export default class RedisPublisher {
   private redis: Redis;

   constructor() {
      this.redis = new Redis('redis://localhost:6379');
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

      const data: ParsedMessage = {
         type: 'TERMINAL_STREAM',
         payload: log,
      };

      await this.publish(channel, data);
   }

   public async publish_status(
      userId: string,
      contractId: string,
      status: 'started' | 'completed' | 'failed',
   ): Promise<void> {
      const channel = PodTemplate.get_pod_name(userId, contractId);
      const data: ParsedMessage = {
         type: 'TERMINAL_STREAM',
         payload: status,
      };
      await this.publish(channel, data);
   }
}
