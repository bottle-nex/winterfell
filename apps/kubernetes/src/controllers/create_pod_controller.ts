import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { pod_service } from '../services/init_services';

export default async function createPodController(req: Request, res: Response) {
   try {
      const { userId, sessionId, projectName } = req.body;

      await pod_service.create_pod({
         userId,
         sessionId,
         projectName,
      });

      // await podService.copy_codebase_to_pod(pod_name, codebase_json);

      res.status(200).json({
         message: 'Pod created successfully',
      });
      return;
   } catch (error) {
      logger.error('Error while creating pod', error);
      throw error;
   }
}
