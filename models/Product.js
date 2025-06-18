import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema(
  {
    // Unikt ID för produkten (ofta samma som _id från MongoDB, men kan vara en egen specifik om önskas)
    productId: {
      type: String,
      required: true,
      unique: true,
      trim: true // Trimmar bort vita mellanslag från början och slutet
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    desc: {
      type: String,
      required: false, // Beskrivning är valfri
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0 // Priset kan inte vara negativt
    },
  },
  {
    timestamps: true // Lägger automatiskt till createdAt och updatedAt
  }
);

// Skapar Mongoose-modellen
const Product = mongoose.model('Product', ProductSchema);

export default Product;
