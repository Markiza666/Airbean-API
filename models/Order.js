import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: String,         // ID för användaren (kan vara string eller ObjectId beroende på implementation)
  items: Array,           // Lista med produkter/items, kan specificeras mer detaljerat
  date: { type: Date, default: Date.now }, // När ordern skapades
  status: { type: String, default: 'Pending' } // Status t.ex. Pending, Delivered, etc.
});

// Exportera modellen
const Order = mongoose.model('Order', OrderSchema);
export default Order;