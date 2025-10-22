import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { pod_service } from '../services/init_services';

export default function getPodStatusController(req: Request, res: Response) {
   try {
      const { userId, sessionId } = req.body;

      pod_service.get_pod_status(userId, sessionId);

      res.status(200).json({
         message: 'Status fetched successfully',
      });
      return;
   } catch (error) {
      logger.error('Error while fetching pod status', error);
      throw error;
   }
}
