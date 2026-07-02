import { Types } from 'mongoose';
import { Session, SessionStatus, ISession } from '../models/Session';
import { Teacher } from '../models/Teacher';
import { User } from '../models/User';
import AppError from '../utils/AppError';
import { getDayRangeFromTimestamp } from '../helpers/date.helper';

export const createSessionService = async (data: {
  teacherId: string;
  startTime: string;
  endTime: string;
}): Promise<ISession> => {
  const { teacherId, startTime, endTime } = data;

  if (!Types.ObjectId.isValid(teacherId)) {
    throw new AppError('Invalid teacher ID', 400);
  }

  const teacher = await Teacher.findById(teacherId).lean();
  if (!teacher) {
    throw new AppError('Teacher not found', 404);
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError('Invalid date format for startTime or endTime', 400);
  }

  if (end <= start) {
    throw new AppError('endTime must be greater than startTime', 400);
  }

  const session = await Session.create({
    teacherId: new Types.ObjectId(teacherId),
    startTime: start,
    endTime: end,
    status: SessionStatus.AVAILABLE,
  });

  return session;
};

export const getAvailableSessionsService = async (dateTimestamp: string) => {
  if (!dateTimestamp || isNaN(Number(dateTimestamp))) {
    throw new AppError('dateTimestamp query parameter is required and must be a number', 400);
  }

  const { startOfDay, endOfDay } = getDayRangeFromTimestamp(dateTimestamp);

  const sessions = await Session.aggregate([
    {
      $match: {
        status: SessionStatus.AVAILABLE,
        startTime: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    { $sort: { startTime: 1 } },
    {
      $lookup: {
        from: 'teachers',
        localField: 'teacherId',
        foreignField: '_id',
        as: 'teacher',
      },
    },
    { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
  ]);

  return sessions;
};

export const bookSessionService = async (
  sessionId: string,
  userId: string
): Promise<ISession> => {
  if (!Types.ObjectId.isValid(sessionId)) {
    throw new AppError('Invalid session ID', 400);
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError('Invalid user ID', 400);
  }

  const user = await User.findById(userId).lean();
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.status === SessionStatus.BOOKED) {
    throw new AppError('Session has already been booked', 409);
  }

  if (session.status !== SessionStatus.AVAILABLE) {
    throw new AppError('Only AVAILABLE sessions can be booked', 400);
  }

  session.status = SessionStatus.BOOKED;
  session.userId = new Types.ObjectId(userId);
  await session.save();

  return session;
};

export const completeSessionService = async (sessionId: string): Promise<ISession> => {
  if (!Types.ObjectId.isValid(sessionId)) {
    throw new AppError('Invalid session ID', 400);
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    throw new AppError('Session not found', 404);
  }

  if (session.status !== SessionStatus.BOOKED) {
    throw new AppError('Only BOOKED sessions can be marked as completed', 400);
  }

  session.status = SessionStatus.COMPLETED;
  session.completedAt = new Date();
  await session.save();

  return session;
};
