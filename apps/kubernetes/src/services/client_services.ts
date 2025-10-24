import { FileContent } from "../types/file_type";
import axios from 'axios';
import { logger } from "../utils/logger";

export async function get_files(contractId: string): Promise<FileContent[]> {
    try {
        const { data } = await axios.get(`${process.env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`);
        return data;
    } catch (error) {
        logger.error(`Failed to get files`, error);
        throw new Error;
    }
}