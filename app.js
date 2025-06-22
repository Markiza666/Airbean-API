import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

// Importerar rutter
import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js'; 

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Rot-route för att testa om servern körs
app.get('/', (req, res) => {
    res.send('AIR BEAN');
});

// Använder rutter
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api/', aboutRoutes);
app.use('/api', userRoutes); 

// Global felhantering - förblir densamma, men tänk på asynkrona fel
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Något gick fel på servern!" });
});

export default app;
