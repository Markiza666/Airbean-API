import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },          // coffee-name
  description: { type: String },                     // Description
  price: { type: Number, required: true },          // Price
});

const Product = mongoose.model('Product', productSchema);

export default Product;