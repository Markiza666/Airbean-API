import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({ // Ett underschema (subdocument schema) som är inbäddat direkt i OrderSchema.
  product: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: false },
    price: { type: Number, required: true },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});


const OrderSchema = mongoose.Schema({
  userId: String,         // ID för användaren (kan vara string eller ObjectId beroende på implementation)
  items: Array,           // Lista med produkter/items, kan specificeras mer detaljerat
  date: { type: Date, default: Date.now }, // När ordern skapades
  status: { type: String, default: 'Pending' }, // Status t.ex. Pending, Delivered, etc.
  total: { 
    type: Number, 
    required: true
  } // Totalt belopp för ordern
});

// Exporterar modellen
const Order = mongoose.model('Order', OrderSchema);
export default Order;