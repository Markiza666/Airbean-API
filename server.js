import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

connectDB();

const PORT = 3000;

console.log(' Mongo URI:', process.env.MONGO_URI); // Check if it loads correctly

// Connect to MongoDB and start server when connect is done
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB ');
    app.listen(PORT, () => {
      console.log(`Server körs på port ${PORT}`);
      console.log(`Besök http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err.message); // Använd err.message för tydligare felmeddelande
    process.exit(1); // Avsluta processen vid anslutningsfel
  });
  