import { Request, Response } from 'express';
import { podService } from '..';
import { logger } from '../utils/logger';

export default function deletePodController(req: Request, res: Response) {
   try {
      const { userId, sessionId } = req.body;

      podService.delete_pod(userId, sessionId);

      return res.status(200).json({
         message: 'Deleted pod successfully',
      });
   } catch (error) {
      logger.error('Error while deleting pod', error);
      throw error;
   }
}
