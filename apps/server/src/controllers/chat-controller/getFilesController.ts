import { Request, Response } from 'express';
import { CloudfrontFileParser } from '../../services/code_editor_parser';

export default async function getFilesController(req: Request, res: Response) {
    const contractId = req.params.contractId;

    if (!contractId) {
        return res.status(400).json({
            message: 'contract-id not found',
        });
    }

    const fileList = [
        `${contractId}/programs/counter/src/lib.rs`,
        `${contractId}/programs/counter/src/errors/mod.rs`,
        `${contractId}/tests/counter.ts`,
        `${contractId}/Anchor.toml`,
    ];

    try {
        const getFileContent = async (fileKey: string): Promise<string> => {
            // console.log('file key is: ', fileKey);
            const fileUrl = `${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`;
            const response = await fetch(fileUrl);

            if (!response.ok) {
                console.error('Failed to fetch file content:', response.status);
                return '';
            }

            return await response.text();
        };

        const parser = new CloudfrontFileParser({
            fileList,
            getFileContent,
            rootName: contractId,
        });

        const tree = await parser.build_tree();
        res.status(200).json(tree);
    } catch (error) {
        console.error('Error fetching files', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
