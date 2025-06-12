import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Användarnamn
  password: { type: String, required: true },                // Lösenord
  // Här kan du lägga till fler fält, t.ex. email eller roll
});

const User = mongoose.model('User', userSchema);

export default User;