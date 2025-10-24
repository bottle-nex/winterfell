import { FileContent } from "../types/file_type";
import axios from 'axios';
import { logger } from "../utils/logger";

export async function get_files(contractId: string): Promise<FileContent[]> {
    try {
        const response = await axios.get(`${process.env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`);
        return response.data.data;    
    } catch (error) {
        logger.error(`Failed to get files`, error);
        throw new Error;
    }
}