import axios from 'axios';
import { env } from '../configs/configs.env';

export class PodServices {

    static async get_codebase(contract_id: string) {
        try {
            if (!contract_id) {
                console.error('Insufficient credentials');
                return;
            }

            const { data } = await axios.get(`${env.SERVER_CLOUDFRONT_DOMAIN}/${contract_id}`);
            return data;
        } catch (error) {
            console.error('Failed to fetch contract');
            return;
        }
    }

    static get_pod_name(user_id: string, contract_id: string): string {
        if (!user_id && !contract_id) {
            throw new Error('Insufficient credentials');
        }
        let name = `anchor-pod-template-${user_id}-${contract_id}`.toLowerCase();
        if (name.length > 63) {
            name = name.substring(0, 63);
        }
        return name;
    }

}