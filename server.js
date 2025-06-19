import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000; // Använder miljövariabel för port, med fallback som rekommenderas

// Anropar connectDB och startar servern när anslutningen är klar
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server körs på port ${PORT}`);
      console.log(`Besök http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Initial MongoDB Connection Error (server.js):', err.message);
    process.exit(1);
  });
