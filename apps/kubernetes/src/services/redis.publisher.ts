import { Redis } from 'ioredis';
import { logger } from '../utils/logger';
import PodTemplate from '../utils/pod-templates';

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
         console.warn('Published message to channel', { channel });
      } catch (error) {
         logger.error('Error publishing message', { channel, error });
         throw error;
      }
   }

   public async disconnect(): Promise<void> {
      await this.redis.quit();
      logger.info('Redis publisher disconnected');
   }

   public async publish_build_log(
      userId: string,
      contractId: string,
      log: string,
      type: 'stdout' | 'stderr' = 'stdout',
   ): Promise<void> {
      const channel = PodTemplate.get_pod_name(userId, contractId);
      console.log('channel is : ', channel);
      await this.publish(channel, {
         type: 'log',
         data: log,
         stream: type,
         timestamp: new Date().toISOString(),
      });
   }

   public async publish_status(
      userId: string,
      contractId: string,
      status: 'started' | 'completed' | 'failed',
      metadata?: any,
   ): Promise<void> {
      const channel = PodTemplate.get_pod_name(userId, contractId);
      await this.publish(channel, {
         type: 'status',
         status,
         metadata,
         timestamp: new Date().toISOString(),
      });
   }
}
