import mongoose from 'mongoose';

// Schema for a SINGLE item/product within an order
const orderItemSchema = mongoose.Schema({
  product: {
    id: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: false },
    price: { type: Number, required: true },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // At least 1
  },
}, { _id: false }); // Omit if each orderItem needs a unique _id

// Main schema for the entire order
const OrderSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  orderId: { //  Custom generated order ID (e.g., timestamp-random)
    type: String,
    required: true,
    unique: true
  },

  items: [orderItemSchema],

  total: { // Total amount
    type: Number,
    required: true,
    min: 0 // Total can not be empty
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'], // Allows only these values 
    default: 'Pending'
  },
  eta: {
    type: Date,
    required: true
  },
  deliveryAddress: {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true }
  }
},
  {
    timestamps: true // Automatically adds `createdAt` och `updatedAt`
  });

const Order = mongoose.model('Order', OrderSchema);
export default Order;
