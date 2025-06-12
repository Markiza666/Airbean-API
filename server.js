import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config(); // se till att miljövariabler laddas

console.log('📡 Mongo URI:', process.env.MONGO_URI); // För att se att den laddas korrekt

// Koppla till MongoDB och starta servern när kopplingen är klar
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB 🔗');
    app.listen(4000, () => {
      console.log(`👂 Server is listening on port ${process.env.PORT || 4000}`);
    });
    console.log('Servern är klar')
  })
  .catch((err) => console.error('‼️ MongoDB Connection Error!', err));