import express from 'express';
import dotenv from 'dotenv';

// Import routes
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// use routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products',productRoutes);

export default app; // exportera app för att kunna importera i server.js