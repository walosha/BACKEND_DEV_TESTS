import mongoose from 'mongoose';

export const initializeDB = () => {
  console.log(process.env.DATABASE_URL);
  mongoose
    .connect(process.env.DATABASE_URL as string, {})
    .then(() => console.log('DB connection successful!'))
    .catch(console.log);
};
