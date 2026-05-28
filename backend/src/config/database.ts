import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Expect MongoDB Atlas string from env
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/assessment-creator';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
