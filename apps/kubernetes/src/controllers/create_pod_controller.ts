import { Request, Response } from 'express';
import PodService from '../services/pod.services';
import { podService } from '..';
import { logger } from '../utils/logger';

export default function createPodController(req: Request, res: Response) {
   try {
      const { userId, sessionId, projectName } = req.body;

      podService.create_pod({
         userId,
         sessionId,
         projectName,
      });

      return res.status(200).json({
         message: 'Pod created successfully',
      });
   } catch (error) {
      logger.error('Error while creating pod', error);
      throw error;
   }
}
