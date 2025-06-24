import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000; // Environment variable for port

// Executes connectDB and start server once connection is established

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
