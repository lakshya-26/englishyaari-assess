import 'express-async-errors';
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db';
import userRoutes from './routes/user.routes';
import teacherRoutes from './routes/teacher.routes';
import sessionRoutes from './routes/session.routes';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/teachers', teacherRoutes);
app.use('/sessions', sessionRoutes);

app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
