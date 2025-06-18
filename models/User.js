import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Username
  password: { type: String, required: true },                // Password
}, {
  timestamps: true  // createdAt, updatedAt
})


const User = mongoose.model('User', userSchema);

export default User;