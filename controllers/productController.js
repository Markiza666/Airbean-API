import Product from '../models/Product.js';

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta produkter' });
  }
};

export default { getProducts };