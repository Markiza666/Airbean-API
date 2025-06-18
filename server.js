import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config(); // Load variables

console.log(' Mongo URI:', process.env.MONGO_URI); // Check if it loads correctly
const PORT = 3000;

// Connect to MongoDB and start server when connect is done
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB ');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Connection Error!', err));