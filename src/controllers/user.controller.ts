import { Request, Response } from 'express';
import { createUserService, getUserSessionsService } from '../services/user.service';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, phone } = req.body;
  const user = await createUserService({ fullName, email, phone });
  res.status(201).json({ success: true, data: user });
};

export const getUserSessions = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const sessions = await getUserSessionsService(id);
  res.status(200).json({ success: true, data: sessions });
};
