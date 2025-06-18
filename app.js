import express from 'express';
import dotenv from 'dotenv';
// import connectDB from './config/db.js';

// Import routes
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import productRoutes from './routes/products.js'

dotenv.config();
// connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// use routes
app.use('/api/users', userRoutes);  // För /api/users/profile, /api/users/login, /api/users/register
app.use('/api/orders', orderRoutes);    // För /api/orders, /api/orders/:orderId/status, /api/orders/history
app.use('/api/products',productRoutes); // För /api/menu


// ME	User Story 1: Som användare vill jag se en enkel startsida med bara logotypen så att jag omedelbart känner igen varumärket. 
app.get('/', (req, res) => {
    res.send('AIR BEAN');   // API:ets enkla välkomstmeddelande/namn och implicit i res.send(), Express skickar 200 OK som standard för lyckade svar
});

export default app; // exportera app för att kunna importera i server.js