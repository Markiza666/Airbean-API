import express from 'express';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Root route to verify server is running
app.get('/', (req, res) => {
    res.send('AIR BEAN');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api/', aboutRoutes);
app.use('/api', userRoutes);

// Global error handler to catch all unhandled errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Något gick fel på servern!" });
});

export default app;
