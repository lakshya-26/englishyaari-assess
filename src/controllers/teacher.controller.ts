import { Request, Response } from 'express';
import { createTeacherService } from '../services/teacher.service';

export const createTeacher = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, specialization, experience } = req.body;
  const teacher = await createTeacherService({ fullName, email, specialization, experience });
  res.status(201).json({ success: true, data: teacher });
};
