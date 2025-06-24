import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema(
  {
    // Unique ID for product
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true // Removes whitespace from the beginning and end of the string
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    desc: {
      type: String,
      required: false, // Optional description
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0 // Price can not be negative
    },
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Create Mongoose model
const Product = mongoose.model('Product', ProductSchema);

export default Product;
