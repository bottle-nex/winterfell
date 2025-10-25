import { RUN_COMMAND_URL } from '@/routes/api_routes';
import axios from 'axios';

export default async function executeCommandServer(
    command: string,
    contractId: string,
    token: string,
) {
    try {
        const res = await axios.post(
            RUN_COMMAND_URL,
            {
                command: command,
                contractId: contractId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return res.data;
    } catch (error) {}
}
