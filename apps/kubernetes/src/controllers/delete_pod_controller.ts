import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { pod_service } from '../services/init_services';

export default function deletePodController(req: Request, res: Response) {
   try {
      const { userId, sessionId } = req.body;

      pod_service.delete_pod(userId, sessionId);

      res.status(200).json({
         message: 'Deleted pod successfully',
      });
      return;
   } catch (error) {
      logger.error('Error while deleting pod', error);
      throw error;
   }
}
