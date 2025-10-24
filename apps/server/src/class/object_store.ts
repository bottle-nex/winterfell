import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import env from '../configs/env';
import { FileContent } from '../types/content_types';

export default class ObjectStore {
    private s3: S3Client;
    private bucket: string;

    constructor() {
        this.s3 = new S3Client({
            region: env.SERVER_AWS_REGION,
            credentials: {
                accessKeyId: env.SERVER_AWS_ACCESS_KEY_ID,
                secretAccessKey: env.SERVER_AWS_SECRET_ACCESS_KEY,
            },
        });
        this.bucket = env.SERVER_AWS_BUCKET_NAME;
    }

    public async uploadContractFiles(
        contractId: string,
        files: FileContent[],
        rawLlmResponse: string,
    ) {
        const uploadedFiles: string[] = [];

        for (const file of files) {
            const key = `${contractId}/resource/${file.path}`;

            const upload = new Upload({
                client: this.s3,
                params: {
                    Bucket: this.bucket,
                    Key: key,
                    Body: file.content,
                },
            });

            await upload.done();
            uploadedFiles.push(key);
        }

        const rawKey = `${contractId}/raw/llm-response.txt`;
        const rawUpload = new Upload({
            client: this.s3,
            params: {
                Bucket: this.bucket,
                Key: rawKey,
                Body: rawLlmResponse,
                ContentType: 'text/plain',
            },
        });
        await rawUpload.done();
        uploadedFiles.push(rawKey);
    }

    public async uploadFile(contractId: string, path: string, content: string | Buffer) {
        const key = `${contractId}/${path}`;

        const upload = new Upload({
            client: this.s3,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: content,
            },
        });

        await upload.done();
        return key;
    }

    public get_raw_files(contractId: string) {
        return `${process.env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/raw/llm-response.txt`;
    }

    public get_resource_files(contractId: string) {
        return `${process.env.SERVER_CLOUDFRONT_DOMAIN}/${contractId}/resource`;
    }
}
