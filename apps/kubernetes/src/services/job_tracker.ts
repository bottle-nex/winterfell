import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { env } from '../configs/env.config';
import { JOB_STATUS } from '../types/worker_queue_types';

export default class JobTracker {
   private redis: Redis;
   private KEY_PREFIX = 'job';
   private LOCK_TTL = 3600;

   constructor() {
      this.redis = new Redis(env.KUBERNETES_REDIS_URL);
   }

   private get_key(contractId: string) {
      return `${this.KEY_PREFIX}${contractId}`;
   }

   public async acquire_lock(contractId: string) {
      const key = this.get_key(contractId);
      // const existing = await this.redis.get(key);

      // if (existing) {
      //     const current_status = existing as JOB_STATUS;
      // }

      await this.redis.setex(key, this.LOCK_TTL, JOB_STATUS.QUEUED);
      console.log('Lock acquired');
   }

   public async update_status(contractId: string, status: JOB_STATUS) {
      const key = this.get_key(contractId);
      await this.redis.setex(key, this.LOCK_TTL, status);
   }

   public async release_lock(contractId: string) {
      const key = this.get_key(contractId);
      await this.redis.del(key);
   }

   public async get_status(contractId: string) {
      const key = this.get_key(contractId);
      const status = await this.redis.get(key);
      return status as JOB_STATUS;
   }

   public async is_locked(contractId: string) {
      const key = this.get_key(contractId);
      const exists = await this.redis.exists(key);
      return exists === 1;
   }
}
