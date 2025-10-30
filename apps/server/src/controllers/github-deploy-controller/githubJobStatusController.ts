import { Request, Response } from 'express';
import { github_worker_queue } from '../../services/init';

export default async function githubJobStatusController(req: Request, res: Response) {
    const jobId = req.body;

    if (!jobId) {
        return res.status(400).json({
            error: 'jobId is required',
        });
    }

    try {
        const job = await github_worker_queue.getJob(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        const state = await job.getState();
        const progress = job.progress();
        const failedReason = job.failedReason;
        const returnvalue = job.returnvalue;

        const status = {
            jobId: job.id,
            state: state,
            progress: progress,
            data: job.data,
            attempts: job.attemptsMade,
            maxAttempts: job.opts.attempts,
            timestamp: job.timestamp,
        };

        if (state === 'completed') {
            return res.status(200).json({
                success: true,
                status: 'completed',
                ...status,
                result: returnvalue,
            });
        } else if (state === 'failed') {
            return res.status(200).json({
                success: false,
                status: 'failed',
                ...status,
                error: failedReason,
                stackTrace: job.stacktrace,
            });
        } else if (state === 'active') {
            return res.status(200).json({
                success: true,
                status: 'processing',
                ...status,
                message: 'Job is currently being processed',
            });
        } else {
            return res.status(200).json({
                success: true,
                status: state,
                ...status,
                message: `Job is ${state}`,
            });
        }
    } catch (error) {
        console.error('Error fetching job status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch job status',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
