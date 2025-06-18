import mongoose from 'mongoose';

// Detta är schemat för EN ENKEL vara/produkt som ligger inom en order.
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
    min: 1, // Måste vara minst 1
  },
}, { _id: false }); // Lägger till { _id: false } om du INTE vill ha ett unikt _id för varje orderItem.
                    // Om varje item ska kunna refereras unikt i arrayen, ta bort _id:false.
                    // För inbäddade listor är _id: false vanligt för att spara utrymme.


// Detta är huvudschemat för hela ordern.
const OrderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Bättre att använda ObjectId för userId
    required: true,
    ref: 'User'
  },
  orderId: { // Ditt egna genererade order-ID (t.ex. order-timestamp-random)
    type: String,
    required: true,
    unique: true
  },
  
  items: [orderItemSchema], 

  total: { // Totalt belopp för ordern
    type: Number,
    required: true,
    min: 0 // Totalen kan inte vara negativ
  },
  orderedAt: { // När ordern skapades (ofta används istället for 'date' för tydlighet)
    type: Date,
    default: Date.now
  },
  status: { 
    type: String,
    enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'], // Tillåter endast dessa värden
    default: 'Pending'
  },
  eta: { 
    type: Date,
    required: true 
  },
  deliveryAddress: { 
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    zip: { type: String, required: true, trim: true }
  }
},
{
  timestamps: true // Lägger automatiskt till `createdAt` och `updatedAt`
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
