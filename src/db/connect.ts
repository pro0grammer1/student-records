import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './authInfo';

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');

  } catch (error) {

    console.error('MongoDB connection error:', error);
    throw error;
  }

  try {
    const existingAdmin = await User.findOne({ email: 'admin@email.com' });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('abcd1234', 12);

      await User.create({
        email: 'admin@email.com',
        password: hashedPassword,
        name: 'Admin'
      });

      console.log('Default admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
}