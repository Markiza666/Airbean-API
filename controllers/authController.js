import User from '../models/User.js'; // Import with .js import 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import { uuid } from 'uuidv4'; // Import specific 'uuid' from uuidv4 
import dotenv from 'dotenv'; 

dotenv.config(); 

const register = async (req, res) => { 
   const { username, password } = req.body; 
   try { 
      const existingUser = await User.findOne({ username }); 
      if (existingUser) { return res.status(409).json({ error: "Användarnamnet är redan upptaget." }); } 
      const hashedPassword = await bcrypt.hash(password, 10); 
      const userId = uuid(); 
      const newUser = await User.create({ userId, username, password: hashedPassword });
      res.status(201).json({ message: "Användare registrerad framgångsrikt!", userId: newUser.userId }); 
   } catch (error) { console.error("Registrering misslyckades:", error); res.status(500).json({ error: "Serverfel vid registrering." }); } 
};

const login = async (req, res) => { 
   const { username, password } = req.body; 
   try { 
      const user = await User.findOne({ username }); 
      if (!user) { return res.status(401).json({ error: "Ogiltiga användaruppgifter." }); } 
      const isMatch = await bcrypt.compare(password, user.password); 
      if (!isMatch) { return res.status(401).json({ error: "Ogiltiga användaruppgifter." }); } 
      const token = jwt.sign( 
         { userId: user.userId, username: user.username }, 
         process.env.JWT_SECRET, 
         { expiresIn: '1h' } 
      ); 
      res.json({ message: "Inloggning lyckades!", token, userId: user.userId }); 
   } catch (error) { console.error("Inloggning misslyckades:", error); res.status(500).json({ error: "Serverfel vid inloggning." }); } 
}; 

const getProfile = async (req, res) => { 
   const userId = req.user.userId; 
   try { 
      const user = await User.findOne({ userId }).select('-password'); 
      if (!user) { return res.status(404).json({ error: "Användaren hittades inte." }); } 
      res.json({ userId: user.userId, username: user.username }); 
   } catch (error) { console.error("Kunde inte hämta profil:", error); res.status(500).json({ error: "Serverfel vid hämtning av profil." }); } 
};

export default {register, login, getProfile};