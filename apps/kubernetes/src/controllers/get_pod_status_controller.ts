import { Request, Response } from 'express';
import { podService } from '..';
import { logger } from '../utils/logger';

export default function getPodStatusController(req: Request, res: Response) {
   try {
      const { userId, sessionId } = req.body;

      podService.get_pod_status(userId, sessionId);

      return res.status(200).json({
         message: 'Status fetched successfully',
      });
   } catch (error) {
      logger.error('Error while fetching pod status', error);
      throw error;
   }
}
