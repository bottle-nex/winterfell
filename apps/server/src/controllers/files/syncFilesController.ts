import { prisma } from '@repo/database';
import { Request, Response } from 'express';

export default async function syncFilesController(req: Request, res: Response) {
    try {
        const user = req.user;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const { contractId, files } = req.body;

        const isValidContract = await prisma.contract.findUnique({
            where: {
                id: contractId,
                userId: user.id,
            },
        });

        if (!isValidContract) {
            res.status(404).json({
                success: false,
                message: `You're not a valid owner`,
            });
            return;
        }

        // now upload the files to s3 and send this changed data to the kubernetes cluster, so that it can change the data in the container as well
    } catch (error) {
        console.error('Error while syncing files: ', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
        return;
    }
}
