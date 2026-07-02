import { Schema, model, Document } from 'mongoose';

export interface ITeacher extends Document {
  fullName: string;
  email: string;
  specialization: string;
  experience: number;
}

const teacherSchema = new Schema<ITeacher>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    specialization: { type: String, required: true, trim: true },
    experience: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        ret._id = undefined;
      },
    },
  }
);

export const Teacher = model<ITeacher>('Teacher', teacherSchema);
