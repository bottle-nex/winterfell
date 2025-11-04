import { BuildStatus, prisma } from '@repo/database';
import { BuildCacheCheck, BuildJobPayload, COMMAND } from '@repo/types';
import crypto from 'crypto';
import { redis_streams } from '../services/init';

export default class BuildService {
    /**
     * Generates a SHA-256 hash from a given code string.
     * This method trims the input code and returns a hexadecimal hash string.
     * @param {string} code - The source code or input text to hash.
     * @returns {string} A hexadecimal SHA-256 hash of the provided code.
     */
    static generate_code_hash(code: string): string {
        return crypto.createHash('sha256').update(code.trim()).digest('hex');
    }

    /**
     * Checks whether the current contract build can be reused from the cache.
     * This method compares the SHA-256 hash of the current source code with the one
     * stored in the database. If both match, and the last build was successful with
     * a non-null IDL, it concludes that the build can be reused.
     *
     * @param {string} contractId - ID of the contract.
     * @param {string} currentCode - The current contract source code.
     * @returns {Promise<BuildCacheCheck>} Whether the build can be reused, along with cache info.
     */
    static async check_build_cache(
        contractId: string,
        currentCode: string,
    ): Promise<BuildCacheCheck> {
        try {
            const contract = await prisma.contract.findUnique({
                where: {
                    id: contractId,
                },
            });

            const current_code_hash = this.generate_code_hash(currentCode);

            if (!contract?.codeHash) {
                return {
                    isCached: false,
                    canReuseBuild: false,
                    codeHash: current_code_hash,
                    lastBuildStatus: 'NEVER_BUILT',
                };
            }
            const canReuse: boolean =
                current_code_hash === contract.codeHash &&
                contract.lastBuildStatus === 'SUCCESS' &&
                contract.idl !== null;
            return {
                isCached: canReuse,
                canReuseBuild: canReuse,
                codeHash: current_code_hash,
                lastBuildStatus: contract.lastBuildStatus,
            };
        } catch (err) {
            console.error('Error whle checking build cache', err);
            return {
                isCached: false,
                codeHash: null,
                lastBuildStatus: 'NEVER_BUILT',
                canReuseBuild: false,
            };
        }
    }

    /**
     * Queues a build job to Redis Stream
     * @param contractId
     * @param userId
     * @param contractName
     * @returns Job identifiers or null if queuing fails
     */

    static async queue_build_job(contractId: string, userId: string, contractName: string) {
        try {
            const payload: BuildJobPayload = {
                command: COMMAND.WINTERFELL_BUILD,
                jobId: '',
                contractId,
                userId,
                timestamp: Date.now(),
                contractName,
            };

            const result = await redis_streams.add_to_redis_stream(
                COMMAND.WINTERFELL_BUILD,
                payload,
            );
            await prisma.contract.update({
                where: { id: contractId },
                data: {
                    lastBuildStatus: BuildStatus.QUEUED,
                    lastBuildId: result?.buildJobId,
                },
            });
        } catch (err) {
            console.error('error while queuing build job', err);
        }
    }
}
