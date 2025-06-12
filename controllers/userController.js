import User from '../models/User.js';

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Saknas användarnamn eller lösenord' });
  }

  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte skapa användare' });
  }
};

export default { registerUser };