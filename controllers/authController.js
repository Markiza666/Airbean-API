import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // Handle async errors in Express

// Register User
// POST /api/register
// Public route
const register = asyncHandler(async (req, res) => {
   const { username, password } = req.body;
   // Check if username and password are provided
   if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord måste anges." });
   }
   // Verify if username already exists
   const existingUser = await User.findOne({ username });
   if (existingUser) {
      return res.status(409).json({ error: "Användarnamnet är redan upptaget." });
   }
   // Hash the password before storing
   const hashedPassword = await bcrypt.hash(password, 10);
   // Create a new user; MongoDB automatically generates _id
   const newUser = await User.create({ username, password: hashedPassword });
   // Send success response with created user's ID
   res.status(201).json({ message: "Användare registrerad framgångsrikt!", userId: newUser._id });
});

// Login User
// POST /api/login
// Public route
const login = asyncHandler(async (req, res) => {
   const { username, password } = req.body;
   // Check if username and password are provided
   if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord måste anges." });
   }
   // Find user by username
   const user = await User.findOne({ username });
   if (!user) {
      return res.status(401).json({ error: "Ogiltiga användaruppgifter." });
   }
   // Compare entered password with hashed password in DB
   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
      return res.status(401).json({ error: "Ogiltiga användaruppgifter." });
   }

   // Sign JWT token with user-ID and username
   const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
   );
   // Send response with token and user ID
   res.json({ message: "Inloggning lyckades!", token, userId: user._id });
});

export { register, login }; // Export only authentication functions
