import User from '../models/User.js';
import bcrypt from 'bcryptjs'; // För lösenordshashning
import jwt from 'jsonwebtoken'; // För JWT skapande
import asyncHandler from 'express-async-handler'; // För att hantera asynkrona fel i Express

// Register User
// POST /api/register
// Public
const register = asyncHandler(async (req, res) => {
   const { username, password } = req.body;

   if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord måste anges." });
   }

   const existingUser = await User.findOne({ username });
   if (existingUser) {
      return res.status(409).json({ error: "Användarnamnet är redan upptaget." });
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   // Skapar användaren utan att manuellt generera userId, Mongoose hanterar _id
   const newUser = await User.create({ username, password: hashedPassword });

   res.status(201).json({ message: "Användare registrerad framgångsrikt!", userId: newUser._id });
});

// Login User
// POST /api/login
// Public
const login = asyncHandler(async (req, res) => {
   const { username, password } = req.body;

   if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord måste anges." });
   }

   const user = await User.findOne({ username });
   if (!user) {
      return res.status(401).json({ error: "Ogiltiga användaruppgifter." });
   }

   const isMatch = await bcrypt.compare(password, user.password);
   if (!isMatch) {
      return res.status(401).json({ error: "Ogiltiga användaruppgifter." });
   }

   // Signera JWT:n med användarens MongoDB _id
   const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
   );

   res.json({ message: "Inloggning lyckades!", token, userId: user._id });
});

export { register, login }; // Exporterar endast autentiseringsfunktioner
