import { Teacher, ITeacher } from '../models/Teacher';

export const createTeacherService = async (data: {
  fullName: string;
  email: string;
  specialization: string;
  experience: number;
}): Promise<ITeacher> => {
  const teacher = await Teacher.create(data);
  return teacher;
};
