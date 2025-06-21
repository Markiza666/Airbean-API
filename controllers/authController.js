import User from '../models/User.js';
import bcrypt from 'bcryptjs'; // För lösenordshashning
import jwt from 'jsonwebtoken'; // För JWT skapande
// Använder uuidv4 för att generera unika användar-ID:n
import { v4 as uuidv4 } from 'uuid'; // Kontrollera om uuidv4 är ett separat paket eller om det är ett skrivfel i importen för standard uuid paketet.



const register = async (req, res) => { 
   const { username, password } = req.body; 

   // Grundläggande validering: Kontrollera om användarnamn och lösenord finns
   if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord måste anges." });
   }

   try { 
      const existingUser = await User.findOne({ username }); 
      if (existingUser) { 
         return res.status(409).json({ error: "Användarnamnet är redan upptaget." });
      }

      const hashedPassword = await bcrypt.hash(password, 10); 
      const userId = uuidv4(); 
      const newUser = await User.create({ userId, username, password: hashedPassword });
      res.status(201).json({ message: "Användare registrerad framgångsrikt!", userId: newUser.userId }); 
   } catch (error) { 
      console.error("Registrering misslyckades:", error); 
      res.status(500).json({ error: "Serverfel vid registrering." }); 
   } 
};

const login = async (req, res) => { 
   const { username, password } = req.body;

    // Grundläggande validering
   if (!username || !password) {
      return res.status(400).json({ error: "Användarnamn och lösenord måste anges." });
   } 
   
   try { 
      const user = await User.findOne({ username }); 
      if (!user) { 
         return res.status(401).json({ error: "Ogiltiga användaruppgifter." }); 
      } 

      const isMatch = await bcrypt.compare(password, user.password); // Jämför det angivna lösenordet med det hashade lösenordet i databasen
      if (!isMatch) { 
         return res.status(401).json({ error: "Ogiltiga användaruppgifter." }); 
      } 

      const token = jwt.sign( // Signerar JWT:n med process.env.JWT_SECRET.
         { userId: user.userId, username: user.username }, 
         process.env.JWT_SECRET, 
         { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Använder JWT_EXPIRES_IN från .env, med fallback
      );

      res.json({ message: "Inloggning lyckades!", token, userId: user.userId }); 
   } catch (error) { 
      console.error("Inloggning misslyckades:", error); 
      res.status(500).json({ error: "Serverfel vid inloggning." }); 
   } 
}; 

const getProfile = async (req, res) => { 
   // req.user kommer från en middleware (t.ex. authMiddleware) som dekodar JWT
   // Se till att du har en sådan middleware implementerad och använder den på denna route.
   if (!req.user || !req.user.userId) {
      return res.status(403).json({ error: "Åtkomst nekad: Ingen användaridentifierare i token." });
   }

   const userId = req.user.userId; 

   try { 
      const user = await User.findOne({ userId }).select('-password -_id -__v'); 
      if (!user) { 
         return res.status(404).json({ error: "Användaren hittades inte." }); 
      } 
      res.json({ userId: user.userId, username: user.username }); 
   } catch (error) { 
      console.error("Kunde inte hämta profil:", error); 
      res.status(500).json({ error: "Serverfel vid hämtning av profil." }); 
   } 
};

export default { register, login, getProfile };
