// app.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

// Importerar rutter
import authRoutes from './routes/authRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js'; 

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Rot-route för att testa om servern körs
app.get('/', (req, res) => {
    res.send('AIR BEAN');
});
// Använder rutter
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api/about', aboutRoutes);

// Global felhantering - förblir densamma, men tänk på asynkrona fel
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Något gick fel på servern!" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server körs på port ${PORT}`);
    console.log(`Besök http://localhost:${PORT}`);
});

