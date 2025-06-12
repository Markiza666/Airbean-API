import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Namn på kaffet
  description: { type: String },                     // Beskrivning
  price: { type: Number, required: true },          // Pris
});

const Product = mongoose.model('Product', productSchema);

export default Product;