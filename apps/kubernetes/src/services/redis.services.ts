import Redis from 'ioredis';

export class RedisLockService {
    private redis: Redis;
    private ttlSeconds: number = 1000;

    constructor(redis: Redis) {
        this.redis = redis;
    }

    /**
     * builds a unique key for a user and contract
     * @param user_id 
     * @param contract_id 
     * @returns lock_key
     */
    private get_lock_key(user_id: string, contract_id: string): string {
        return `lock:anchor;${user_id}:${contract_id}`;
    }

    /**
     * Creates a lock in redis for ttlSeconds
     * 
     * @param user_id 
     * @param contract_id 
     * @returns  
     */
    public async create_lock(user_id: string, contract_id: string) {
        const lock_key = this.get_lock_key(user_id, contract_id);
        const result = await this.redis.set(lock_key, '1', 'EX', this.ttlSeconds, 'NX');
        return result === 'OK';
    }

    /**
     * Checks whether a lock already exists
     * 
     * @param user_id 
     * @param contract_id 
     * @returns 
     */
    public async is_locked(user_id: string, contract_id: string) {
        const lock_key = this.get_lock_key(user_id, contract_id);
        const exists = await this.redis.exists(lock_key);
        return exists === 1;
    }

    /**
     * Deleted the key from redis
     * 
     * @param user_id 
     * @param contract_id 
     * @returns 
     */
    public async del_key(user_id: string, contract_id: string) {
        const lock_key = this.get_lock_key(user_id, contract_id);
        const deleted = await this.redis.del(lock_key);
        return deleted === 1;
    }

}