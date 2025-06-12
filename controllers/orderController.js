// Anta att du har en Order-modell i `models/Order.js`
import Order from '../models/Order.js';

const createOrder = async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Felaktig data' });
  }

  try {
    const newOrder = new Order({
      userId,
      items,
      date: new Date(),
      status: 'Pending'
    });
    await newOrder.save();
    res.json({ orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte skapa order' });
  }
};

export default { createOrder };