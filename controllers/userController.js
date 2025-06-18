import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'min-hemliga-nyckel';

//Register new use
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Saknas användarnamn eller lösenord' });
  }

  try {
    const newUser = new User({ username, password });
    await newUser.save();

    // Create JWT-token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      SECRET_KEY,
      { expiresIn: '1h' } 
    );


    res.json({ userId: newUser._id, token });
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte skapa användare' });
  }
};


// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Saknas användarnamn eller lösenord' });
  }

  try {
    // Get user from database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
    }

    // Compare password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Fel användarnamn eller lösenord' });
    }

    // Create JWT-token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ userId: user._id, token });
  } catch (err) {
    res.status(500).json({ error: 'Inloggning misslyckades' });
  }
};

export default { registerUser, loginUser };