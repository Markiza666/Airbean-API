import Product from '../models/Product.js';
import menuData from '../data/menu.json' assert { type: 'json' };

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Kunde inte hämta produkter' });
  }
};


const getMenu = async (req, res) => {
  try {
    const menu = menuData;
    res.status(200).json(menu); // Skickar 200 OK
  } catch (error) {
    console.error("Kunde inte hämta menyn:", error);
    res.status(500).json({ error: "Serverfel vid hämtning av menyn." });
  }
};


export default { getProducts, getMenu};