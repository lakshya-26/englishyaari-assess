import { Types } from 'mongoose';
import { User, IUser } from '../models/User';
import { Session, SessionStatus } from '../models/Session';
import AppError from '../utils/AppError';

export const createUserService = async (data: {
  fullName: string;
  email: string;
  phone: string;
}): Promise<IUser> => {
  const user = await User.create(data);
  return user;
};

export const getUserSessionsService = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new AppError('Invalid user ID', 400);
  }

  const userExists = await User.findById(userId).lean();
  if (!userExists) {
    throw new AppError('User not found', 404);
  }

  const result = await Session.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $facet: {
        upcomingSessions: [
          { $match: { status: SessionStatus.BOOKED } },
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
        ],
        completedSessions: [
          { $match: { status: SessionStatus.COMPLETED } },
          { $sort: { completedAt: -1 } },
          {
            $lookup: {
              from: 'teachers',
              localField: 'teacherId',
              foreignField: '_id',
              as: 'teacher',
            },
          },
          { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
        ],
      },
    },
  ]);

  return result[0];
};
