import { Contract } from '@repo/database';
import crypto from 'crypto';

export default class BuildCache {
    static check_build_cache(contract: Contract) {
        const old_contract_hash = contract.codeHash;
        const current_state_hash = this.create_hash(contract.code);
        return old_contract_hash === current_state_hash;
    }

    static create_hash(current_state: string | null): string | null {
        if (!current_state) {
            return null;
        }

        return crypto.createHash('md5').update(current_state).digest('hex');
    }
}
