import { SYNC_FILES_URL } from '@/routes/api_routes';
import { FileNode } from '@/src/types/prisma-types';
import axios from 'axios';

export default class CodeEditorServer {
    public static async syncFiles(files: FileNode[], token: string): Promise<boolean> {
        try {
            const { data } = await axios.post(SYNC_FILES_URL, files, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                return true;
            }

            console.error('Server returned unsuccessfull response: ', data.message);
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
