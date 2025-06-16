import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config(); // se till att miljövariabler laddas

console.log(' Mongo URI:', process.env.MONGO_URI); // För att se att den laddas korrekt
const PORT = 3000;

// Koppla till MongoDB och starta servern när kopplingen är klar
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB ');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Connection Error!', err));