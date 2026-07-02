import { Request, Response } from 'express';
import {
  createSessionService,
  getAvailableSessionsService,
  bookSessionService,
  completeSessionService,
} from '../services/session.service';

export const createSession = async (req: Request, res: Response): Promise<void> => {
  const { teacherId, startTime, endTime } = req.body;
  const session = await createSessionService({ teacherId, startTime, endTime });
  res.status(201).json({ success: true, data: session });
};

export const getAvailableSessions = async (req: Request, res: Response): Promise<void> => {
  const { dateTimestamp } = req.query as { dateTimestamp: string };
  const sessions = await getAvailableSessionsService(dateTimestamp);
  res.status(200).json({ success: true, data: sessions });
};

export const bookSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { userId } = req.body;
  const session = await bookSessionService(id, userId);
  res.status(200).json({ success: true, data: session });
};

export const completeSession = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const session = await completeSessionService(id);
  res.status(200).json({ success: true, data: session });
};
