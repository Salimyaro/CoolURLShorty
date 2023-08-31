import { Request, Response, NextFunction } from 'express';
import logger from './winstonLogger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error Message: ${err.message}`);
  res.status(500).json({
    message: err.message
  });
};
